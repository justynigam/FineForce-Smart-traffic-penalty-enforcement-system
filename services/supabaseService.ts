import { supabase } from './supabaseClient';
import { Violation, ViolationStatus } from '../types';


// --- Data Mapping Utilities ---
// Converts a Supabase record (snake_case columns) to our app's Violation type (camelCase properties)
const fromSupabase = (record: any): Violation => {
    if (!record) return record;
    return {
        id: record.id,
        vehicleNumber: record.vehicle_number,
        violationType: record.violation_type,
        date: new Date(record.date).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }).replace(',', ''),
        location: record.location,
        status: record.status,
        imageUrl: record.image_url,
        fine: record.fine,
        description: record.description || '', // Fallback to empty string if column is missing on select
        confidenceScore: record.confidence_score,
        contributingFactors: record.contributing_factors || [],
    };
};

/**
 * Fetches all violations from the Supabase 'violations' table.
 * @returns A promise that resolves to an array of Violation objects.
 */
export const getViolations = async (): Promise<Violation[]> => {
    const { data, error } = await supabase
        .from('violations')
        .select('*')
        .order('date', { ascending: false });

    if (error) {
        console.error('Error fetching violations:', error.message, { details: error });
        throw new Error(error.message);
    }

    return data.map(fromSupabase);
};

/**
 * Uploads a file to a Supabase Storage bucket named 'violations'.
 * The file is placed in a folder named after the user's ID to comply with RLS policies.
 * @param file The file (image or video) to upload.
 * @returns The public URL of the uploaded file.
 */
export const uploadFile = async (file: File): Promise<string> => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        throw new Error("Authentication error: Could not retrieve current user for file upload. Please log in again.");
    }

    // Create a unique file path inside a folder named after the user's ID.
    // This is a common pattern for satisfying storage RLS policies.
    const filePath = `${user.id}/${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    
    const { error: uploadError } = await supabase.storage
        .from('violations') // Assumes a bucket named 'violations' exists
        .upload(filePath, file);

    if (uploadError) {
        console.error('Error uploading file:', uploadError.message, { details: uploadError });
        throw new Error(uploadError.message);
    }

    const { data } = supabase.storage
        .from('violations')
        .getPublicUrl(filePath);
        
    return data.publicUrl;
};

/**
 * Adds a new violation record to the database.
 * NOTE: This function now generates a UUID on the client-side to bypass
 * the "not-null constraint" error caused by a misconfigured database schema
 * where the 'id' column does not have an auto-generating default value.
 * @param violationData The core data for the new violation.
 * @returns A promise that resolves to the newly created and formatted Violation object.
 */
export const addViolation = async (violationData: Omit<Violation, 'id' | 'date' | 'status'>): Promise<Violation> => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        throw new Error("Authentication error: User must be logged in to create a violation.");
    }
    
    const recordToInsert = {
        id: crypto.randomUUID(), // Generate UUID on the client
        vehicle_number: violationData.vehicleNumber,
        violation_type: violationData.violationType,
        location: violationData.location,
        image_url: violationData.imageUrl,
        fine: violationData.fine,
        description: violationData.description,
        confidence_score: violationData.confidenceScore,
        contributing_factors: violationData.contributingFactors,
        user_id: user.id,
        date: new Date().toISOString(),
        status: ViolationStatus.Pending,
    };

    const { data: newRecord, error } = await supabase
        .from('violations')
        .insert(recordToInsert)
        .select()
        .single();
        
    if (error) {
        console.error('Error inserting violation:', error.message, { details: error });

        if (error.message.includes('permission denied')) {
            throw new Error("Database Permission Denied: The current user is not allowed to insert new violations. Please check the Row Level Security (RLS) policies on the 'violations' table.");
        }
        
        throw new Error(`Failed to save violation: ${error.message}`);
    }
    
    if (!newRecord) {
        throw new Error("Saving failed: The database did not return the new violation record.");
    }

    return fromSupabase(newRecord);
};


/**
 * Updates the status of a specific violation in the database.
 * @param violationId The ID of the violation to update.
 * @param newStatus The new status to set for the violation.
 * @returns A promise that resolves to the updated Violation object, or null if not found.
 */
export const updateViolationStatus = async (violationId: string, newStatus: ViolationStatus): Promise<Violation | null> => {
    const { data, error } = await supabase
        .from('violations')
        .update({ status: newStatus })
        .eq('id', violationId)
        .select()
        .single();

    if (error) {
        console.error('Error updating status:', error.message, { details: error });
        // If the row doesn't exist, Supabase might throw an error. Return null in that case.
        if (error.code === 'PGRST116') { 
            return null;
        }
        throw new Error(error.message);
    }

    return fromSupabase(data);
};
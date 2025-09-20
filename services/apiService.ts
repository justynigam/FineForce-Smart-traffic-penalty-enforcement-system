import { Violation } from '../types';

// This interface defines the data structure for the email notification payload.
// It includes all violation details plus the recipient's email and a QR code URL.
interface EmailPayload extends Violation {
  email: string;
  qrCodeUrl: string; // This will be a base64 data URL
}

// Defines the structure of the mocked API response.
interface ApiResponse {
    success: boolean;
    messageId: string;
    timestamp: string;
}

/**
 * Generates an HTML email body for the violation notice.
 * @param violationDetails The details of the violation.
 * @returns A string containing the HTML for the email.
 */
const generateEmailHtml = (violationDetails: EmailPayload): string => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Traffic Violation Notice</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
        h2 { color: #d9534f; }
        ul { list-style-type: none; padding: 0; }
        li { background-color: #f9f9f9; border: 1px solid #eee; padding: 10px; margin-bottom: 8px; border-radius: 4px; }
        strong { color: #555; }
        .qr-code { text-align: center; margin-top: 20px; }
        .footer { margin-top: 30px; font-size: 0.9em; color: #777; }
    </style>
</head>
<body>
    <h2>Official Traffic Violation Notice</h2>
    <p>Dear Citizen,</p>
    <p>A traffic violation has been recorded for a vehicle associated with this email address. Please review the details below:</p>
    
    <ul>
        <li><strong>Vehicle Number:</strong> ${violationDetails.vehicleNumber}</li>
        <li><strong>Violation Type:</strong> ${violationDetails.violationType}</li>
        <li><strong>Date & Time:</strong> ${violationDetails.date}</li>
        <li><strong>Location:</strong> ${violationDetails.location}</li>
        <li><strong>Description:</strong> ${violationDetails.description}</li>
        <li><strong>Fine Amount:</strong> ₹${violationDetails.fine.toLocaleString('en-IN')}</li>
    </ul>

    <div class="qr-code">
        <p>To ensure a swift resolution, please pay the fine using the QR code below with any UPI-enabled payment app.</p>
        <img src="${violationDetails.qrCodeUrl}" alt="Payment QR Code">
    </div>

    <p class="footer">
        This is an automated notification from the FineForce system. For any disputes, please visit our portal with your violation ID: ${violationDetails.id}.
        <br>
        Thank you for your cooperation in keeping our roads safe.
    </p>
</body>
</html>
    `;
};


/**
 * Simulates sending the violation notification to a backend server.
 * This mock function now generates a full HTML email body and logs it
 * to demonstrate what would be sent to the violator's Gmail.
 * @param violationDetails The complete details of the violation to be sent.
 * @returns A promise that resolves with a mock API response.
 */
export const sendViolationEmail = async (violationDetails: EmailPayload): Promise<ApiResponse> => {
    console.log("--- MOCK BACKEND API CALL: Sending Email ---");
    console.log(`Recipient: ${violationDetails.email}`);
    
    const emailHtml = generateEmailHtml(violationDetails);

    console.log("--- Generated Email Body (HTML) ---");
    // We log the raw HTML so it can be inspected if needed.
    console.log(emailHtml);
    console.log("---------------------------------------");

    // Simulate network delay of 1.5 seconds to mimic a real API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate a successful response from the server
    return {
        success: true,
        messageId: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        timestamp: new Date().toISOString(),
    };
};
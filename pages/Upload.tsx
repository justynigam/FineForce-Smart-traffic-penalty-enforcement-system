import React, { useState, useCallback, useRef, useEffect } from 'react';
import { generateFineFromMedia } from '../services/geminiService';
import { uploadFile } from '../services/supabaseService';
import { Violation, Page, ViolationStatus } from '../types';
import QRCode from 'qrcode';
import { VIOLATION_FINES, VIOLATION_TYPES } from '../constants';
import { sendViolationEmail } from '../services/apiService';

const PhotoIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
);

const CheckCircleIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
  </svg>
);

const XMarkIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

const ArrowPathIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.696v4.992h-4.992m0 0-3.181-3.183a8.25 8.25 0 0 1 11.667 0l3.181 3.183" />
    </svg>
);

const ExclamationTriangleIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
);

const QrCodeIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V7.5a3 3 0 0 0-3-3H3.75Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 1.5v2.25m5.25 2.25H21v-2.25m-2.25 15v2.25m-15-2.25H1.5v-2.25m12-12v2.25m-9-2.25H3v2.25m3.75 12h.008v.008H6.75v-.008Zm3.75 0h.008v.008h-.008v-.008Zm3.75 0h.008v.008h-.008v-.008Zm-3.75-3.75h.008v.008h-.008v-.008Zm3.75 0h.008v.008h-.008v-.008Zm-3.75-3.75h.008v.008h-.008v-.008Zm0 0h.008v.008h-.008v-.008Zm.008 0h.008v.008h-.008v-.008Zm-3.75 3.75h.008v.008h-.008v-.008Zm0 0h.008v.008h-.008v-.008Zm.008 0h.008v.008h-.008v-.008Zm-3.75-3.75h.008v.008h-.008v-.008Zm0 0h.008v.008h-.008v-.008Zm.008 0h.008v.008h-.008v-.008ZM6.75 9h.008v.008H6.75V9Zm.008 0h.008v.008h-.008V9Zm0 0h.008v.008H6.75V9Z" />
    </svg>
);


// --- Toast Component Definition ---
interface ToastProps {
  message: string;
  onClose: () => void;
}
const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 right-6 bg-white rounded-xl shadow-2xl border border-slate-200/80 p-4 max-w-sm w-full z-[100] animate-slide-in-right">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <CheckCircleIcon className="h-6 w-6 text-green-500" />
        </div>
        <div className="ml-3 w-0 flex-1 pt-0.5">
          <p className="text-sm font-semibold text-slate-800">Success</p>
          <p className="mt-1 text-sm text-slate-600">{message}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
            <button onClick={onClose} className="inline-flex rounded-md p-1 text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400">
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-5 w-5" />
            </button>
        </div>
      </div>
    </div>
  );
};
// --- End Toast Component ---

type PageState = 'upload' | 'analyzing' | 'review' | 'saving' | 'sending-email' | 'success' | 'scanning';

interface AnalysisData {
    vehicleNumber: string;
    violationType: Violation['violationType'] | 'Unclear';
    fine: number;
    location: string;
    description: string;
    confidenceScore: number;
    contributingFactors: string[];
}

interface UploadPageProps {
  onAddNewViolation: (violation: Omit<Violation, 'id' | 'date' | 'status'>) => Promise<Violation>;
  onUpdateStatus: (violationId: string, newStatus: ViolationStatus) => void;
  onNavigate: (page: Page) => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ onAddNewViolation, onUpdateStatus, onNavigate }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [pageState, setPageState] = useState<PageState>('upload');
  const [error, setError] = useState<{ message: string; details?: string } | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null);
  const [violatorEmail, setViolatorEmail] = useState('');
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isPreprocessing, setIsPreprocessing] = useState(false);
  const [processedImageData, setProcessedImageData] = useState<{data: string, mimeType: string} | null>(null);
  const [lastSavedViolationId, setLastSavedViolationId] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<number | null>(null);


  const resetState = () => {
    setFile(null);
    setPreview(null);
    setPageState('upload');
    setError(null);
    setAnalysisResult(null);
    setViolatorEmail('');
    setIsPreprocessing(false);
    setProcessedImageData(null);
    setLastSavedViolationId(null);
  };
  
  const preprocessFile = async (selectedFile: File) => {
    setFile(selectedFile); // Keep original for upload
    setProcessedImageData(null);
    setError(null);
    setPreview(null);
    setIsPreprocessing(true);
    
    try {
        const image = new Image();
        const objectUrl = URL.createObjectURL(selectedFile);
        image.src = objectUrl;

        await new Promise<void>((resolve, reject) => {
            image.onload = () => { URL.revokeObjectURL(objectUrl); resolve(); };
            image.onerror = reject;
        });

        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1024;
        const scale = Math.min(1, MAX_WIDTH / image.width);
        canvas.width = image.width * scale;
        canvas.height = image.height * scale;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');
        
        ctx.filter = 'brightness(1.1) contrast(1.1) saturate(1.2)';
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        const mimeType = 'image/jpeg';
        const base64Data = dataUrl.split(',')[1];

        setPreview(dataUrl); // Show enhanced preview
        setProcessedImageData({ data: base64Data, mimeType });

    } catch (err) {
        console.error("Image preprocessing failed:", err);
        setError({ message: "Failed to enhance image. Using original file for analysis." });
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        await new Promise<void>((resolve, reject) => {
            reader.onload = () => {
                const result = reader.result as string;
                setPreview(result);
                const mimeType = result.split(':')[1].split(';')[0];
                const base64Data = result.split(',')[1];
                setProcessedImageData({ data: base64Data, mimeType });
                resolve();
            };
            reader.onerror = reject;
        });
    } finally {
        setIsPreprocessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        preprocessFile(selectedFile);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!processedImageData) {
      setError({ message: "Please provide an image for analysis." });
      return;
    }

    setPageState('analyzing');
    setError(null);
    
    try {
      const { data, mimeType } = processedImageData;
      const response = await generateFineFromMedia(data, mimeType);
      const responseJson = JSON.parse(response.text);
      setAnalysisResult(responseJson);
      setPageState('review');

    } catch (err) {
      console.error("AI analysis failed:", err);
      let errorMessage = "An unexpected error occurred during AI analysis.";
      if (err instanceof Error) {
        if (err.message.includes('JSON')) {
          errorMessage = "AI analysis returned an invalid format. The image might be unclear or unsupported.";
        } else {
           errorMessage = `AI analysis failed: ${err.message}`;
        }
      }
      setError({ message: errorMessage });
      setPageState('upload');
    }
  };
  
const handleConfirmSave = async () => {
    if (!file || !analysisResult || analysisResult.violationType === 'Unclear') {
        setError({ message: "Cannot save, violation type is not specified." });
        return;
    }
    if (!violatorEmail || !/^\S+@\S+\.\S+$/.test(violatorEmail)) {
        setError({ message: "Please enter a valid email address for the notification." });
        return;
    }
    
    setPageState('saving');
    setError(null);

    let imageUrl: string;
    try {
        imageUrl = await uploadFile(file);
    } catch (err) {
        console.error("File upload failed:", err);
        setError({ message: `File Upload Failed: ${err instanceof Error ? err.message : 'Unknown error'}` });
        setPageState('review');
        return;
    }

    let newViolation: Violation;
    try {
        const violationData = {
            vehicleNumber: analysisResult.vehicleNumber,
            violationType: analysisResult.violationType,
            fine: analysisResult.fine,
            location: analysisResult.location,
            description: analysisResult.description,
            confidenceScore: analysisResult.confidenceScore,
            contributingFactors: analysisResult.contributingFactors,
            imageUrl: imageUrl,
        };
        newViolation = await onAddNewViolation(violationData);
    } catch (err) {
        console.error("Failed to save violation record:", err);
        setError({ message: `Saving failed: ${err instanceof Error ? err.message : 'Unknown error'}` });
        setPageState('review');
        return;
    }

    setPageState('sending-email');
    try {
        const paymentUrl = `https://fineforce.demo/pay?id=${newViolation.id}`;
        const qrCodeUrl = await QRCode.toDataURL(paymentUrl, { width: 200 });
        
        const emailPayload = { ...newViolation, email: violatorEmail, qrCodeUrl };
        await sendViolationEmail(emailPayload);
        
        setToastMessage(`Violation ${newViolation.id} saved & notification sent to ${violatorEmail}.`);
        setLastSavedViolationId(newViolation.id);
        setPageState('success');

    } catch (err) {
        console.error("Failed to send notification:", err);
        setError({ message: `Violation saved, but email failed: ${err instanceof Error ? err.message : 'Unknown error'}` });
        setPageState('review');
    }
  };

  const handleViolationTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as Violation['violationType'];
    const newFine = VIOLATION_FINES[newType] || 0;
    setAnalysisResult(prev => prev ? {...prev, violationType: newType, fine: newFine} : null);
  };
  
    const stopScanner = useCallback(() => {
        if (scanIntervalRef.current) {
            cancelAnimationFrame(scanIntervalRef.current);
            scanIntervalRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    }, []);

    const handleQrCodeDetected = useCallback(async (rawValue: string) => {
        stopScanner();
        try {
            const url = new URL(rawValue);
            const violationId = url.searchParams.get('id');
            if (violationId) {
                await onUpdateStatus(violationId, ViolationStatus.Paid);
                setToastMessage(`Success! Violation ${violationId} has been marked as paid.`);
                resetState();
            } else {
                setError({ message: 'Invalid QR Code: No violation ID found.' });
                setPageState('success');
            }
        } catch (err) {
            console.error("QR handling error:", err);
            setError({ message: 'Invalid QR Code format. Please scan a valid payment QR code.' });
            setPageState('success');
        }
    }, [onUpdateStatus, stopScanner]);

    const startScanner = useCallback(async () => {
        if (!('BarcodeDetector' in window)) {
            setError({ message: 'QR code scanning is not supported by your browser.' });
            setPageState('success');
            return;
        }
        try {
            streamRef.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
                videoRef.current.srcObject = streamRef.current;
                await videoRef.current.play();

                const barcodeDetector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
                
                const detect = async () => {
                    if (videoRef.current && videoRef.current.readyState >= 2) {
                        const barcodes = await barcodeDetector.detect(videoRef.current);
                        if (barcodes.length > 0) {
                            handleQrCodeDetected(barcodes[0].rawValue);
                        } else {
                            scanIntervalRef.current = requestAnimationFrame(detect);
                        }
                    } else {
                       scanIntervalRef.current = requestAnimationFrame(detect);
                    }
                };
                detect();
            }
        } catch (err) {
            console.error("Camera access error:", err);
            setError({ message: 'Could not access camera. Please grant permission.' });
            setPageState('success');
        }
    }, [handleQrCodeDetected]);

    useEffect(() => {
        if (pageState === 'scanning') {
            startScanner();
        } else {
            stopScanner();
        }
        return () => {
            stopScanner();
        };
    }, [pageState, startScanner, stopScanner]);

  const getButtonState = () => {
    switch(pageState) {
        case 'upload':
            return { 
                text: isPreprocessing ? 'Enhancing Image...' : 'Analyze Evidence', 
                disabled: !file || isPreprocessing || !processedImageData, 
                showSpinner: isPreprocessing, 
                action: handleAnalyze 
            };
        case 'analyzing':
            return { text: 'Analyzing...', disabled: true, showSpinner: true, action: () => {} };
    }
  }

  const getRightPanelButtonState = () => {
    switch(pageState) {
        case 'review':
             return { text: 'Confirm, Save & Notify', disabled: analysisResult?.violationType === 'Unclear' || !violatorEmail.trim() || !/^\S+@\S+\.\S+$/.test(violatorEmail), showSpinner: false, action: handleConfirmSave };
        case 'saving':
             return { text: 'Saving...', disabled: true, showSpinner: true, action: () => {} };
        case 'sending-email':
            return { text: 'Sending Notification...', disabled: true, showSpinner: true, action: () => {} };
        default:
            return null;
    }
  }
  
  const formButtonState = getButtonState();
  const rightPanelButtonState = getRightPanelButtonState();
  
  const renderContent = () => {
      if (pageState === 'success') {
        return (
            <div className="text-center py-10 flex flex-col items-center justify-center min-h-[550px] animate-fade-in">
                <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-slate-800">Violation Processed Successfully</h3>
                <p className="text-slate-500 mt-2">
                    Violation <span className="font-semibold text-slate-700 font-mono">{lastSavedViolationId}</span> has been saved and the notification sent.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <button onClick={() => setPageState('scanning')} className="flex items-center justify-center gap-2 w-full sm:w-auto bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition">
                        <QrCodeIcon className="w-5 h-5" /> Scan Payment QR Code
                    </button>
                    <button onClick={resetState} className="w-full sm:w-auto bg-slate-200 text-slate-800 font-semibold py-3 px-6 rounded-lg hover:bg-slate-300 transition">
                        Upload Another Violation
                    </button>
                </div>
            </div>
        );
      }
      if (pageState === 'scanning') {
         return (
            <div className="text-center py-10 flex flex-col items-center justify-center min-h-[550px] animate-fade-in">
                <h3 className="text-2xl font-bold text-slate-800">Scan QR Code</h3>
                <p className="text-slate-500 mt-2 mb-4 max-w-sm">Point your camera at the payment QR code to mark the violation as paid.</p>
                <div className="relative w-full max-w-sm h-64 bg-slate-900 rounded-lg overflow-hidden shadow-lg">
                    <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
                    <div className="absolute inset-0 border-4 border-white/30 rounded-lg pointer-events-none"></div>
                </div>
                <button onClick={() => { setPageState('success'); }} className="mt-6 bg-slate-200 text-slate-800 font-semibold py-2 px-5 rounded-lg hover:bg-slate-300 transition">
                    Cancel Scan
                </button>
            </div>
         );
      }

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <form onSubmit={handleAnalyze} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Upload Violation Media</label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-900/25 px-6 py-10 relative">
                        {isPreprocessing && (
                            <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center rounded-lg z-10">
                                <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <p className="mt-2 text-slate-600 font-semibold">Enhancing Image...</p>
                            </div>
                        )}
                        <div className="text-center">
                            {preview ? (
                                <img src={preview} alt="Preview" className="mx-auto h-32 w-auto rounded-md" />
                            ) : (
                                <PhotoIcon className="mx-auto h-12 w-12 text-slate-300" aria-hidden="true" />
                            )}
                            <div className="mt-4 flex text-sm leading-6 text-slate-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500">
                                <span>{file ? 'Change file' : 'Upload a file'}</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" disabled={pageState !== 'upload'} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs leading-5 text-slate-600">PNG, JPG up to 10MB</p>
                        </div>
                    </div>
                </div>
                
                 {formButtonState && (
                     <button type="submit" disabled={formButtonState.disabled} className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center">
                      {formButtonState.showSpinner && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                      {formButtonState.text}
                    </button>
                 )}
                 {error && !error.details && (<p className="text-sm text-red-600 text-center">{error.message}</p>)}
            </form>
            
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 min-h-[550px] flex flex-col">
                <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-3 mb-6 flex-shrink-0">
                    {pageState === 'review' || pageState === 'saving' ? 'Review AI Analysis' : 'Generated Fine Details'}
                </h3>
                
                {(!analysisResult && pageState !== 'analyzing') && (
                    <div className="m-auto text-center text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-2"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm-4.125 12.375a3.375 3.375 0 1 0 6.75 0 3.375 3.375 0 0 0-6.75 0Z" /></svg>
                        <p>Analysis results will appear here.</p>
                    </div>
                )}
                
                {pageState === 'review' && analysisResult && (
                    <div className="space-y-4 animate-fade-in">
                        {analysisResult.confidenceScore < 70 && analysisResult.violationType !== 'Unclear' && (
                            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-md mb-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="font-semibold text-amber-800">Low Confidence Warning ({analysisResult.confidenceScore}%)</p>
                                        <p className="text-sm text-amber-700 mt-1">The AI's confidence is low. Please carefully review the violation type and all details before saving.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {analysisResult.violationType === 'Unclear' && (
                             <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mb-4">
                                <p className="font-semibold text-yellow-800">AI Analysis Inconclusive</p>
                                <p className="text-sm text-yellow-700">The AI could not confidently identify a violation. Please select the correct violation type below to proceed.</p>
                            </div>
                        )}
                        <div>
                            <label htmlFor="vehicleNumberReview" className="block text-sm font-medium text-slate-700">Vehicle Number (AI Generated)</label>
                            <input type="text" id="vehicleNumberReview" value={analysisResult.vehicleNumber} onChange={e => setAnalysisResult(p => ({...p!, vehicleNumber: e.target.value}))} className="mt-1 block w-full rounded-md border-slate-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-slate-800" />
                        </div>
                         <div>
                            <label htmlFor="violationType" className="block text-sm font-medium text-slate-700">Violation Type</label>
                            <select id="violationType" value={analysisResult.violationType} onChange={handleViolationTypeChange} className="mt-1 block w-full rounded-md border-slate-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-slate-800">
                                {analysisResult.violationType === 'Unclear' && <option value="Unclear" disabled>-- Please Select a Violation --</option>}
                                {VIOLATION_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="fine" className="block text-sm font-medium text-slate-700">Fine Amount (₹)</label>
                            <input type="number" id="fine" value={analysisResult.fine} onChange={e => setAnalysisResult(p => ({...p!, fine: parseInt(e.target.value) || 0}))} className="mt-1 block w-full rounded-md border-slate-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-slate-800" />
                        </div>
                        <div>
                            <label htmlFor="violatorEmail" className="block text-sm font-medium text-slate-700">Violator's Email (for notification)</label>
                            <input type="email" id="violatorEmail" placeholder="example@email.com" value={violatorEmail} onChange={e => setViolatorEmail(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-slate-800" />
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-slate-700">Location</label>
                            <input type="text" id="location" value={analysisResult.location} onChange={e => setAnalysisResult(p => ({...p!, location: e.target.value}))} className="mt-1 block w-full rounded-md border-slate-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-slate-800" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
                            <textarea id="description" rows={2} value={analysisResult.description} onChange={e => setAnalysisResult(p => ({...p!, description: e.target.value}))} className="mt-1 block w-full rounded-md border-slate-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-slate-800" />
                        </div>
                        <p className="text-sm text-slate-500 text-center pt-2">AI Confidence: <span className="font-bold text-blue-600">{analysisResult.confidenceScore}%</span></p>
                    </div>
                )}

                <div className="mt-auto pt-6">
                    {rightPanelButtonState && (
                        <div className="flex items-center space-x-3">
                             <button onClick={resetState} className="w-auto bg-slate-200 text-slate-800 font-semibold py-3 px-4 rounded-lg hover:bg-slate-300 transition flex items-center justify-center">
                                <ArrowPathIcon className="w-5 h-5" />
                            </button>
                            <button onClick={rightPanelButtonState.action} disabled={rightPanelButtonState.disabled} className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center">
                                {rightPanelButtonState.showSpinner && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                                {rightPanelButtonState.text}
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
      );
  }

  return (
    <div>
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
      <h2 className="text-3xl font-bold text-slate-800 mb-6">Manual Violation Upload</h2>
      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200/80">
        {renderContent()}
      </div>
    </div>
  );
};

export default UploadPage;
import React, { useEffect } from 'react';
import { Violation, ViolationStatus } from '../types';

const XMarkIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

const CalendarIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18M-4.5 12h22.5" /></svg>
);

const MapPinIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
);

const CurrencyRupeeIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
);

const SparklesIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>
);

interface ViolationDetailModalProps {
  violation: Violation | null;
  onClose: () => void;
  onUpdateStatus: (violationId: string, newStatus: ViolationStatus) => void;
}

const getStatusClasses = (status: ViolationStatus): string => {
  switch (status) {
    case ViolationStatus.Paid: return 'bg-green-100 text-green-800';
    case ViolationStatus.Pending: return 'bg-yellow-100 text-yellow-800';
    case ViolationStatus.Overdue: return 'bg-red-100 text-red-800';
    default: return 'bg-slate-100 text-slate-800';
  }
};

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number; }> = ({ icon, label, value }) => (
    <div className="flex items-center text-sm">
        <span className="text-slate-400 mr-2">{icon}</span>
        <span className="font-medium text-slate-500 mr-2">{label}:</span>
        <span className="text-slate-800 font-semibold">{value}</span>
    </div>
);

const ViolationDetailModal: React.FC<ViolationDetailModalProps> = ({ violation, onClose, onUpdateStatus }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!violation) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in-fast"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl m-4 flex flex-col lg:flex-row overflow-hidden animate-slide-in-right max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Left: Image */}
        <div className="w-full lg:w-1/2 bg-slate-100 flex items-center justify-center p-4">
            <img src={violation.imageUrl} alt="Violation Evidence" className="max-w-full max-h-full object-contain rounded-lg" />
        </div>

        {/* Right: Details */}
        <div className="w-full lg:w-1/2 p-6 lg:p-8 flex flex-col overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">{violation.violationType}</h2>
                    <p className="font-mono text-sm text-slate-500 mt-1">ID: {violation.id}</p>
                </div>
                <button onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors">
                    <XMarkIcon className="w-6 h-6" />
                    <span className="sr-only">Close modal</span>
                </button>
            </div>
            
            <div className="space-y-3 mb-6">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-slate-500">Vehicle Number</p>
                    <p className="text-xl font-bold text-slate-800 tracking-wider">{violation.vehicleNumber}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <DetailItem icon={<CalendarIcon className="w-4 h-4" />} label="Date & Time" value={violation.date} />
                    <DetailItem icon={<MapPinIcon className="w-4 h-4" />} label="Location" value={violation.location} />
                    <DetailItem icon={<CurrencyRupeeIcon className="w-4 h-4" />} label="Fine" value={`₹${violation.fine.toLocaleString('en-IN')}`} />
                    <div className="flex items-center text-sm col-span-full">
                        <span className="font-medium text-slate-500 mr-2">Status:</span>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClasses(violation.status)}`}>{violation.status}</span>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="text-md font-semibold text-blue-800 flex items-center mb-2">
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    AI Analysis
                </h3>
                <div className="space-y-2 text-sm">
                    <p><strong className="text-blue-700">Description:</strong> {violation.description}</p>
                    <p><strong className="text-blue-700">Confidence:</strong> {violation.confidenceScore}%</p>
                    {violation.contributingFactors?.length > 0 && (
                        <p><strong className="text-blue-700">Factors:</strong> {violation.contributingFactors.join(', ')}</p>
                    )}
                </div>
            </div>
            
            <div className="mt-auto pt-4 border-t border-slate-200">
                <h3 className="text-sm font-semibold text-slate-600 mb-2">Actions</h3>
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={() => onUpdateStatus(violation.id, ViolationStatus.Paid)}
                        disabled={violation.status === ViolationStatus.Paid}
                        className="flex-1 bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition disabled:bg-green-300 disabled:cursor-not-allowed"
                    >
                        Mark as Paid
                    </button>
                     <button 
                        onClick={() => onUpdateStatus(violation.id, ViolationStatus.Pending)}
                        disabled={violation.status === ViolationStatus.Pending}
                        className="flex-1 bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-yellow-600 transition disabled:bg-yellow-300 disabled:cursor-not-allowed"
                    >
                        Revert to Pending
                    </button>
                    <button 
                        onClick={() => onUpdateStatus(violation.id, ViolationStatus.Overdue)}
                        disabled={violation.status === ViolationStatus.Overdue}
                        className="flex-1 bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition disabled:bg-red-300 disabled:cursor-not-allowed"
                    >
                        Flag as Overdue
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ViolationDetailModal;
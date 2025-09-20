import React, { useState, useMemo } from 'react';
import { Violation, ViolationStatus } from '../types';
import { VIOLATION_TYPES } from '../constants';
import ViolationDetailModal from '../components/ViolationDetailModal';

const getStatusClasses = (status: ViolationStatus): string => {
  switch (status) {
    case ViolationStatus.Paid: return 'bg-green-100 text-green-800';
    case ViolationStatus.Pending: return 'bg-yellow-100 text-yellow-800';
    case ViolationStatus.Overdue: return 'bg-red-100 text-red-800';
    default: return 'bg-slate-100 text-slate-800';
  }
};

const MagnifyingGlassIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const CheckCircleIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
  </svg>
);

const ExclamationCircleIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
    </svg>
);


const ITEMS_PER_PAGE = 8;

interface ViolationsPageProps {
  violations: Violation[];
  onUpdateStatus: (violationId: string, newStatus: ViolationStatus) => void;
}

const ViolationsPage: React.FC<ViolationsPageProps> = ({ violations, onUpdateStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ViolationStatus | 'All'>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(0);

  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);
  
  const handleRowClick = (violation: Violation) => {
    setSelectedViolation(violation);
  };

  const handleCloseModal = () => {
    setSelectedViolation(null);
  };

  const handleUpdateStatusInModal = (violationId: string, newStatus: ViolationStatus) => {
    onUpdateStatus(violationId, newStatus);
    // Immediately update status in the modal for better UX
    if (selectedViolation && selectedViolation.id === violationId) {
        setSelectedViolation({ ...selectedViolation, status: newStatus });
    }
  }

  const filteredViolations = useMemo(() => {
    return violations
      .filter(v => statusFilter === 'All' || v.status === statusFilter)
      .filter(v => typeFilter === 'All' || v.violationType === typeFilter)
      .filter(v => 
        v.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [searchTerm, statusFilter, typeFilter, violations]);

  const pageCount = Math.ceil(filteredViolations.length / ITEMS_PER_PAGE);
  const paginatedViolations = filteredViolations.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-800 mb-6">All Violations</h2>
      
      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200/80 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="relative md:col-span-2">
            <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Vehicle No, ID, Location..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }}
              className="bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 placeholder-slate-500"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as any); setCurrentPage(0); }}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800"
            >
              <option value="All">All Statuses</option>
              {Object.values(ViolationStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(0); }}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800"
            >
              <option value="All">All Violation Types</option>
              {VIOLATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Violations Table */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="p-4 font-medium">Vehicle Details</th>
                <th className="p-4 font-medium">Violation Type</th>
                <th className="p-4 font-medium">Date & Time</th>
                <th className="p-4 font-medium">Fine</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Location</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedViolations.map((v) => (
                <tr key={v.id} onClick={() => handleRowClick(v)} className="border-b border-slate-200 hover:bg-slate-50/50 transition-colors cursor-pointer">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img src={v.imageUrl} alt="Violation" className="w-14 h-10 object-cover rounded-md" />
                      <div>
                        <p className="font-semibold text-slate-800">{v.vehicleNumber}</p>
                        <p className="text-xs text-slate-500">{v.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">{v.violationType}</td>
                  <td className="p-4 text-slate-600">{v.date}</td>
                  <td className="p-4 font-medium text-slate-700">₹{v.fine.toLocaleString('en-IN')}</td>
                  <td className="p-4"><span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClasses(v.status)}`}>{v.status}</span></td>
                  <td className="p-4 text-slate-600">{v.location}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onUpdateStatus(v.id, ViolationStatus.Paid); }}
                            disabled={v.status === ViolationStatus.Paid}
                            className="p-1.5 rounded-md text-green-500 hover:bg-green-100 disabled:text-slate-300 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                            title="Manually mark as Paid (e.g., for in-person payment)"
                        >
                            <CheckCircleIcon className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onUpdateStatus(v.id, ViolationStatus.Overdue); }}
                            disabled={v.status === ViolationStatus.Overdue}
                            className="p-1.5 rounded-md text-red-500 hover:bg-red-100 disabled:text-slate-300 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                            title="Manually flag as Overdue"
                        >
                            <ExclamationCircleIcon className="w-5 h-5" />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="p-4 flex items-center justify-between">
          <span className="text-sm text-slate-600">
            Showing {Math.min(currentPage * ITEMS_PER_PAGE + 1, filteredViolations.length)} to {Math.min((currentPage + 1) * ITEMS_PER_PAGE, filteredViolations.length)} of {filteredViolations.length} results
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="px-3 py-1 border border-slate-300 rounded-md text-sm hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700"
            >
              Previous
            </button>
            <span className="text-sm text-slate-600">Page {currentPage + 1} of {pageCount}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(pageCount - 1, p + 1))}
              disabled={currentPage === pageCount - 1}
              className="px-3 py-1 border border-slate-300 rounded-md text-sm hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      
      <ViolationDetailModal
        violation={selectedViolation}
        onClose={handleCloseModal}
        onUpdateStatus={handleUpdateStatusInModal}
      />
    </div>
  );
};

export default ViolationsPage;
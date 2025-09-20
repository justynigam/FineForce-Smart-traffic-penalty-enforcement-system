import React from 'react';
import { ViolationStatus, Violation } from '../types';

const getStatusClasses = (status: ViolationStatus): string => {
  switch (status) {
    case ViolationStatus.Paid:
      return 'bg-green-100 text-green-800';
    case ViolationStatus.Pending:
      return 'bg-yellow-100 text-yellow-800';
    case ViolationStatus.Overdue:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-slate-100 text-slate-800';
  }
};

// FIX: Added missing violation type descriptions to match the `Violation['violationType']` type.
const VIOLATION_TYPE_DESCRIPTIONS: Record<Violation['violationType'], string> = {
  'Speeding': 'Exceeding the posted speed limit.',
  'Red Light': 'Failing to stop at a red traffic light.',
  'No Parking': 'Parking in a restricted or prohibited area.',
  'Wrong Lane': 'Driving in a lane designated for other purposes (e.g., bus lane).',
  'Illegal U-Turn': 'Performing a U-turn where it is not permitted.',
  'No Helmet (Driver)': 'The driver of the two-wheeler is not wearing a helmet.',
  'No Helmet (Pillion)': 'The pillion rider (passenger) on the two-wheeler is not wearing a helmet.',
  'Triple Riding': 'More than two people are riding on a two-wheeler.'
};

const STATUS_DESCRIPTIONS: Record<ViolationStatus, string> = {
  [ViolationStatus.Paid]: 'The fine for this violation has been successfully paid.',
  [ViolationStatus.Pending]: 'The violation has been issued and is awaiting payment.',
  [ViolationStatus.Overdue]: 'The payment deadline has passed and the fine is now overdue.'
};

const ViolationRow: React.FC<{ violation: Violation }> = ({ violation }) => (
  <tr className="border-b border-slate-200 hover:bg-slate-50/50 transition-colors">
    <td className="p-4">
      <div className="flex items-center space-x-4">
        <img src={violation.imageUrl} alt="Violation" className="w-16 h-12 object-cover rounded-md" />
        <div>
          <p className="font-semibold text-slate-800">{violation.vehicleNumber}</p>
          <p className="text-sm text-slate-500">{violation.id}</p>
        </div>
      </div>
    </td>
    <td className="p-4 text-slate-600">
      <div className="relative group cursor-help">
        <span>{violation.violationType}</span>
        <div className="absolute bottom-full mb-2 w-max max-w-xs bg-slate-800 text-white text-xs rounded py-1.5 px-3 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 z-10 left-1/2 -translate-x-1/2 before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-slate-800">
          {VIOLATION_TYPE_DESCRIPTIONS[violation.violationType]}
        </div>
      </div>
    </td>
    <td className="p-4 text-slate-600">
      <div>
        <p>{violation.date.split(' ')[0]}</p>
        <p className="text-xs text-slate-400">{violation.date.split(' ')[1]} {violation.date.split(' ')[2]}</p>
      </div>
    </td>
    <td className="p-4 text-slate-600">{violation.location}</td>
    <td className="p-4">
       <div className="relative group inline-block cursor-help">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClasses(violation.status)}`}>
            {violation.status}
          </span>
          <div className="absolute bottom-full mb-2 w-max max-w-xs bg-slate-800 text-white text-xs rounded py-1.5 px-3 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 z-10 left-1/2 -translate-x-1/2 before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-slate-800">
            {STATUS_DESCRIPTIONS[violation.status]}
          </div>
        </div>
    </td>
  </tr>
);


const ViolationTable: React.FC<{violations: Violation[]}> = ({ violations }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200/80 overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-800">Recent Violations</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="p-4 font-medium">Vehicle Details</th>
              <th className="p-4 font-medium">Violation Type</th>
              <th className="p-4 font-medium">Date & Time</th>
              <th className="p-4 font-medium">Location</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {violations.slice(0, 5).map((violation) => (
              <ViolationRow key={violation.id} violation={violation} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViolationTable;
import React, { ReactNode } from 'react';

interface DashboardCardProps {
    title: string;
    value: string;
    icon: ReactNode;
    change: string;
    changeType: 'increase' | 'decrease';
}

const ArrowUpIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
    </svg>
);

const ArrowDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
    </svg>
);


const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, change, changeType }) => {
    const isIncrease = changeType === 'increase';
    const changeColor = isIncrease ? 'text-green-500' : 'text-red-500';

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
                </div>
                <div className="bg-slate-100 p-3 rounded-full">
                    {icon}
                </div>
            </div>
            <div className="mt-4 flex items-center space-x-1">
                <span className={`flex items-center text-sm font-semibold ${changeColor}`}>
                    {isIncrease 
                        ? <ArrowUpIcon className="w-4 h-4 mr-1"/> 
                        : <ArrowDownIcon className="w-4 h-4 mr-1"/>}
                    {change}
                </span>
                <span className="text-sm text-slate-500">vs last day</span>
            </div>
        </div>
    );
};

export default DashboardCard;
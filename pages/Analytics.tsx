import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ANALYTICS_DATA, VIOLATION_TYPE_DATA, DASHBOARD_CARD_TEMPLATES } from '../constants';
import DashboardCard from '../components/DashboardCard';
import { Violation, ViolationStatus } from '../types';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#10b981'];

interface AnalyticsPageProps {
  violations: Violation[];
}

const isToday = (dateString: string) => {
    try {
        const date = new Date(dateString.split(' ')[0]);
        const today = new Date();
        return date.getFullYear() === today.getFullYear() &&
               date.getMonth() === today.getMonth() &&
               date.getDate() === today.getDate();
    } catch (e) {
        return false;
    }
};

const ViolationTypeDistributionChart: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200/80">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Violation Types</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={VIOLATION_TYPE_DATA}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                        >
                            {VIOLATION_TYPE_DATA.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }} />
                        <Legend wrapperStyle={{fontSize: "14px"}} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const WeeklyViolationsChart: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200/80">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Weekly Violation Trends</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={ANALYTICS_DATA} margin={{ top: 5, right: 20, left: -10, bottom: 5 }} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip cursor={{fill: 'rgba(239, 246, 255, 0.5)'}} contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem'}} labelStyle={{fontWeight: 'bold'}} />
            <Legend wrapperStyle={{fontSize: "14px"}} />
            <Bar dataKey="violations" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};


const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ violations }) => {

  const dashboardMetrics = useMemo(() => {
    const violationsToday = violations.filter(v => isToday(v.date));

    const revenueToday = violationsToday
        .filter(v => v.status === ViolationStatus.Paid)
        .reduce((sum, v) => sum + v.fine, 0);

    const pendingFinesCount = violations.filter(v => v.status === ViolationStatus.Pending).length;

    const metrics = {
        totalViolations: violationsToday.length,
        revenueToday: revenueToday,
        pendingFines: pendingFinesCount,
        activeHotspots: 12, // This remains static for now
    };

    return DASHBOARD_CARD_TEMPLATES.map(template => {
        const value = metrics[template.id];
        let formattedValue = value.toLocaleString('en-IN');
        if (template.id === 'revenueToday') {
            formattedValue = `₹${value.toLocaleString('en-IN')}`;
        }
        return {
            ...template,
            value: formattedValue,
            change: "", // Change calculation is out of scope for this update
        };
    });
  }, [violations]);
  
  return (
    <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Analytics Dashboard</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardMetrics.map((card) => (
            <DashboardCard 
                key={card.id}
                title={card.title}
                value={card.value}
                icon={card.icon}
                change={card.change}
                changeType={card.changeType}
            />
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
                <WeeklyViolationsChart />
            </div>
            <div className="lg:col-span-2">
                <ViolationTypeDistributionChart />
            </div>
        </div>
         {/* Placeholder for more charts */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-md border border-slate-200/80 text-center">
            <h3 className="text-lg font-semibold text-slate-800">More Analytics Coming Soon</h3>
            <p className="text-slate-500 mt-2">Revenue trends, peak violation times, and heatmaps will be available here.</p>
        </div>
    </div>
  );
};

export default AnalyticsPage;
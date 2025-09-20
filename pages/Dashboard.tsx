import React, { useMemo } from 'react';
import DashboardCard from '../components/DashboardCard';
import AnalyticsChart from '../components/AnalyticsChart';
import ViolationTable from '../components/ViolationTable';
import AIAssistant from '../components/AIAssistant';
import { DASHBOARD_CARD_TEMPLATES } from '../constants';
import { Violation, ViolationStatus } from '../types';

interface DashboardPageProps {
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

const DashboardPage: React.FC<DashboardPageProps> = ({ violations }) => {
    
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
        <>
            {/* Dashboard Cards */}
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content: Charts and Tables */}
              <div className="lg:col-span-2 space-y-8">
                <AnalyticsChart />
                <ViolationTable violations={violations} />
              </div>

              {/* AI Assistant */}
              <div className="lg:col-span-1">
                <AIAssistant />
              </div>
            </div>
        </>
    );
};

export default DashboardPage;
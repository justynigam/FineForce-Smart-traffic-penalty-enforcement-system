

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ANALYTICS_DATA } from '../constants';

const AnalyticsChart: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200/80">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Weekly Violation Trends</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={ANALYTICS_DATA}
            margin={{
              top: 5,
              right: 20,
              left: -10,
              bottom: 5,
            }}
            barSize={20}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
                cursor={{fill: 'rgba(239, 246, 255, 0.5)'}}
                contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    color: '#1e293b'
                }} 
                labelStyle={{fontWeight: 'bold'}}
            />
            <Legend wrapperStyle={{fontSize: "14px"}} />
            <Bar dataKey="violations" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsChart;
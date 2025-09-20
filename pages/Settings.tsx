import React, { useState } from 'react';
import { User } from '../types';

interface SettingsPageProps {
    user: User;
}

const InputField: React.FC<{ label: string, type: string, value: string, id: string }> = ({ label, type, value, id }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <input 
            type={type} 
            id={id} 
            defaultValue={value} 
            className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800" 
        />
    </div>
);

const ToggleSwitch: React.FC<{ label: string, enabled: boolean, onToggle: () => void }> = ({ label, enabled, onToggle }) => (
    <div className="flex items-center justify-between">
        <span className="text-slate-700">{label}</span>
        <button
            onClick={onToggle}
            className={`${enabled ? 'bg-blue-600' : 'bg-slate-400'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
            aria-pressed={enabled}
        >
            <span className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
        </button>
    </div>
);


const SettingsPage: React.FC<SettingsPageProps> = ({ user }) => {
    const [notifications, setNotifications] = useState({ email: true, sms: false });

    return (
        <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Navigation or Profile Pic */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200/80 text-center">
                        <img src={`https://i.pravatar.cc/128?u=sanjay_kumar_male`} alt="User Profile" className="w-32 h-32 rounded-full mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-800">{user.name}</h3>
                        <p className="text-slate-500">ID: {user.officerId}</p>
                        <button className="mt-4 w-full bg-slate-100 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-200 transition">
                            Change Picture
                        </button>
                    </div>
                </div>

                {/* Right Column: Settings Forms */}
                <div className="md:col-span-2 space-y-8">
                    {/* Profile Settings */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200/80">
                        <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-3 mb-4">Profile Settings</h3>
                        <div className="space-y-4">
                            <InputField label="Full Name" id="fullName" type="text" value={user.name} />
                            <InputField label="Email Address" id="email" type="email" value={user.email} />
                             <button className="text-sm font-medium text-blue-600 hover:text-blue-800">Change Password</button>
                        </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200/80">
                        <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-3 mb-4">Notification Settings</h3>
                        <div className="space-y-4">
                            <ToggleSwitch label="Email Notifications" enabled={notifications.email} onToggle={() => setNotifications(n => ({...n, email: !n.email}))} />
                            <ToggleSwitch label="SMS Alerts for Overdue Fines" enabled={notifications.sms} onToggle={() => setNotifications(n => ({...n, sms: !n.sms}))} />
                        </div>
                    </div>

                     <div className="flex justify-end space-x-3">
                        <button className="bg-slate-200 text-slate-800 font-semibold py-2 px-6 rounded-lg hover:bg-slate-300 transition">
                            Cancel
                        </button>
                        <button className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
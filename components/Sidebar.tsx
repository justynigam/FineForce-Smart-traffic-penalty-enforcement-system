import React from 'react';
import { NAV_ITEMS } from '../constants';
import { Page } from '../types';

interface SidebarProps {
    activePage: Page;
    onNavigate: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
    return (
        <aside className="w-64 flex-shrink-0 bg-white text-slate-600 flex flex-col border-r border-slate-200">
            <div className="h-20 flex items-center justify-center px-4 border-b border-slate-200">
                <h1 className="text-2xl font-bold text-slate-900 tracking-wider">
                    Fine<span className="text-blue-500">Force</span>
                </h1>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {NAV_ITEMS.map((item) => (
                    <a
                        key={item.name}
                        href={item.href}
                        onClick={(e) => {
                            e.preventDefault();
                            onNavigate(item.name as Page);
                        }}
                        className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                            activePage === item.name
                                ? 'bg-blue-600 text-white font-semibold shadow-md'
                                : 'hover:bg-slate-100 hover:text-slate-900'
                        }`}
                    >
                        <span className="mr-4">{item.icon}</span>
                        <span>{item.name}</span>
                    </a>
                ))}
            </nav>
            <div className="p-4 border-t border-slate-200">
                <p className="text-xs text-slate-400 text-center">FineForce v1.0.0</p>
            </div>
        </aside>
    );
};

export default Sidebar;
import React from 'react';
import { View } from '../types';

interface SidebarProps {
    setView: (view: View) => void;
    activeView: View;
}

const NavItem: React.FC<{ icon: string; label: View; onClick: () => void; isActive: boolean }> = ({ icon, label, onClick, isActive }) => (
    <button
        onClick={onClick}
        className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
            isActive
                ? 'bg-yellow-600 text-white shadow-lg'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
    >
        <span className="text-2xl mr-3">{icon}</span>
        <span className="font-semibold">{label}</span>
    </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ setView, activeView }) => {
    return (
        <aside className="w-48 md:w-56 p-4 bg-black bg-opacity-20 h-[calc(100vh-80px)] sticky top-[80px]">
            <nav className="flex flex-col gap-3">
                <NavItem 
                    icon="🏰" 
                    label={View.Kerajaan} 
                    onClick={() => setView(View.Kerajaan)} 
                    isActive={activeView === View.Kerajaan} 
                />
                <NavItem 
                    icon="🛡️" 
                    label={View.Pertempuran} 
                    onClick={() => setView(View.Pertempuran)} 
                    isActive={activeView === View.Pertempuran} 
                />
                <NavItem 
                    icon="📜" 
                    label={View.Penelitian} 
                    onClick={() => setView(View.Penelitian)} 
                    isActive={activeView === View.Penelitian}
                />
            </nav>
        </aside>
    );
};
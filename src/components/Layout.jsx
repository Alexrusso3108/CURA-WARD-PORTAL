import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  UserCog, 
  Menu, 
  X,
  Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import CriticalPatientsAlert from './CriticalPatientsAlert';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const location = useLocation();
  const { patients } = useApp();
  
  // Get critical patients
  const criticalPatients = patients.filter(p => p.status === 'Critical');

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Wards', href: '/wards', icon: Building2 },
    { name: 'Patients', href: '/patients', icon: Users },
    { name: 'Staff', href: '/staff', icon: UserCog },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-primary-600 to-primary-800 shadow-2xl transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex items-center justify-between h-24 px-6 border-b border-primary-700">
          <div className="flex items-center py-3">
            <img 
              src="/ch logo.png" 
              alt="Cura Hospitals" 
              className="h-20 w-auto drop-shadow-lg"
            />
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-primary-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${active 
                    ? 'bg-white text-primary-700 font-semibold shadow-md' 
                    : 'text-white hover:bg-primary-700 hover:shadow-md'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white border-b">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex-1 lg:flex-none" />
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Critical Patients Alert */}
          {!alertDismissed && (
            <CriticalPatientsAlert 
              criticalPatients={criticalPatients}
              onClose={() => setAlertDismissed(true)}
            />
          )}
          
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

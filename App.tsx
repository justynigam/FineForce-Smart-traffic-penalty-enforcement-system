import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/Dashboard';
import ViolationsPage from './pages/Violations';
import AnalyticsPage from './pages/Analytics';
import EnforcementPage from './pages/Enforcement';
import SettingsPage from './pages/Settings';
import UploadPage from './pages/Upload';
import AIChatbotPage from './pages/AIChatbot';
import PredictiveAnalyticsPage from './pages/PredictiveAnalytics';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

import { Page, Violation, ViolationStatus, User } from './types';
import { getViolations, addViolation, updateViolationStatus } from './services/supabaseService';
import { logout } from './services/authService';
import { supabase } from './services/supabaseClient';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('Dashboard');
  const [violations, setViolations] = useState<Violation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authPage, setAuthPage] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const appUser: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || 'Officer',
          officerId: session.user.user_metadata?.officerId || 'N/A',
        };
        setCurrentUser(appUser);
      } else {
        setCurrentUser(null);
      }
      setIsAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchViolations = async () => {
      if (!currentUser) return; 
      try {
        setIsLoading(true);
        const data = await getViolations();
        setViolations(data);
        setError(null);
      } catch (err) {
        setError("Failed to connect to the database. Please check the Supabase configuration and network connection.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchViolations();
  }, [currentUser]);

  const handleAddNewViolation = async (newViolationData: Omit<Violation, 'id' | 'date' | 'status'>): Promise<Violation> => {
    // The addViolation service now handles setting the id, date, and status.
    const addedViolation = await addViolation(newViolationData);
    setViolations(prev => [addedViolation, ...prev]);
    return addedViolation;
  };

  const handleUpdateViolationStatus = async (violationId: string, newStatus: ViolationStatus) => {
    try {
      const updatedViolation = await updateViolationStatus(violationId, newStatus);
      if(updatedViolation) {
        setViolations(prevViolations => 
          prevViolations.map(v => 
            v.id === violationId ? updatedViolation : v
          )
        );
      }
    } catch (err) {
      console.error("Failed to update violation status:", err);
      setError("Failed to update violation. Please check the Supabase configuration and network connection.");
    }
  };
  
  const handleLogout = async () => {
      await logout();
      setAuthPage('login');
  };
  
  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (!currentUser) {
    if (authPage === 'login') {
      return <LoginPage onNavigateToSignup={() => setAuthPage('signup')} />;
    }
    return <SignupPage onNavigateToLogin={() => setAuthPage('login')} />;
  }

  const renderPage = () => {
    if (isLoading && violations.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="ml-3 text-slate-600">Loading Violation Data...</p>
        </div>
      );
    }

    if (error) {
       return (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
               <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.707-8.293a1 1 0 011.414 0L10 10.586l.293-.293a1 1 0 111.414 1.414L11.414 12l.293.293a1 1 0 01-1.414 1.414L10 13.414l-.293.293a1 1 0 01-1.414-1.414L8.586 12l-.293-.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      );
    }
    
    switch (activePage) {
      case 'Dashboard':
        return <DashboardPage violations={violations} />;
      case 'Violations':
        return <ViolationsPage violations={violations} onUpdateStatus={handleUpdateViolationStatus} />;
      case 'Analytics':
        return <AnalyticsPage violations={violations} />;
      case 'Enforcement':
        return <EnforcementPage />;
      case 'Predictive Analytics':
        return <PredictiveAnalyticsPage />;
      case 'AI Chatbot':
        return <AIChatbotPage />;
      case 'Upload':
        return <UploadPage onAddNewViolation={handleAddNewViolation} onNavigate={setActivePage} onUpdateStatus={handleUpdateViolationStatus} />;
      case 'Settings':
        return <SettingsPage user={currentUser}/>;
      default:
        return <DashboardPage violations={violations} />;
    }
  };

  return (
    <div className="flex h-screen font-sans text-slate-800">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={currentUser} onLogout={handleLogout}/>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-8">
          <div className="container mx-auto h-full">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
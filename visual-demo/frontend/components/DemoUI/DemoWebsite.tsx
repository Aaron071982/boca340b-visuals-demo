'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import Dashboard from './Dashboard';
import LoginForm from './LoginForm';
import TotalPatientsTable from './TotalPatientsTable';
import NewPatientsTable from './NewPatientsTable';
import NewEnrollmentsTable from './NewEnrollmentsTable';
import LostPatientsTable from './LostPatientsTable';
import ReconDetailsTable from './ReconDetailsTable';
import TransactionDetailsTable from './TransactionDetailsTable';
import PurchasesTable from './PurchasesTable';
import EverydayEssentialsTable from './EverydayEssentialsTable';
import Savings340BTable from './Savings340BTable';
import InventoryOnHandTable from './InventoryOnHandTable';
import HRSATable from './HRSATable';
import ShippingInformationTable from './ShippingInformationTable';
import ESPDataTable from './ESPDataTable';
import UserSettings from './UserSettings';

type DemoPage = 
  | 'dashboard' 
  | 'total-patients' 
  | 'new-patients' 
  | 'new-enrollments' 
  | 'lost-patients'
  | 'recon-details' 
  | 'transaction-details' 
  | 'purchases' 
  | 'essentials' 
  | 'savings' 
  | 'inventory' 
  | 'hrsa' 
  | 'shipping' 
  | 'esp-data' 
  | 'settings' 
  | 'help'
  | 'login';

interface DemoWebsiteProps {
  onNavigate: (page: DemoPage, endpoint: string, method?: string) => void;
}

export default function DemoWebsite({ onNavigate }: DemoWebsiteProps) {
  const [activePage, setActivePage] = useState<DemoPage>('dashboard');

  const handleNavigation = (page: string, endpoint: string, method?: string) => {
    const typedPage = page as DemoPage;
    if (typedPage !== activePage) {
      setActivePage(typedPage);
    }
    onNavigate(typedPage, endpoint, method);
  };

  const handleAction = (action: string, endpoint: string, method?: string) => {
    onNavigate(activePage, endpoint, method);
  };

  // Special full-screen layout for login page
  if (activePage === 'login') {
    return (
      <div className="h-screen w-screen">
        <LoginForm onAction={(action, endpoint, method) => handleNavigation('login', endpoint, method)} />
      </div>
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onAction={handleAction} />;
      case 'total-patients':
        return <TotalPatientsTable onAction={handleAction} />;
      case 'new-patients':
        return <NewPatientsTable onAction={handleAction} />;
      case 'new-enrollments':
        return <NewEnrollmentsTable onAction={handleAction} />;
      case 'lost-patients':
        return <LostPatientsTable onAction={handleAction} />;
      case 'recon-details':
        return <ReconDetailsTable onAction={handleAction} />;
      case 'transaction-details':
        return <TransactionDetailsTable onAction={handleAction} />;
      case 'purchases':
        return <PurchasesTable onAction={handleAction} />;
      case 'essentials':
        return <EverydayEssentialsTable onAction={handleAction} />;
      case 'savings':
        return <Savings340BTable onAction={handleAction} />;
      case 'inventory':
        return <InventoryOnHandTable onAction={handleAction} />;
      case 'hrsa':
        return <HRSATable onAction={handleAction} />;
      case 'shipping':
        return <ShippingInformationTable onAction={handleAction} />;
      case 'esp-data':
        return <ESPDataTable onAction={handleAction} />;
      case 'settings':
        return <UserSettings onAction={handleAction} />;
      case 'help':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#2f353a', fontFamily: 'Poppins, sans-serif' }}>
              Help
            </h2>
            <p style={{ color: '#73818f', fontFamily: 'Roboto, sans-serif' }}>Help documentation coming soon...</p>
          </div>
        );
      default:
        return <Dashboard onAction={handleAction} />;
    }
  };

  return (
    <div className="h-screen flex flex-col" style={{ 
      backgroundColor: '#f0f3f5',
      minWidth: '1280px',
      width: '100%'
    }}>
      {/* Header */}
      <Header currentPage={activePage} onAction={handleAction} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar activePage={activePage} onNavigate={handleNavigation} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
          {/* Page Content */}
          <div className="flex-1 overflow-auto">
            {renderPage()}
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
}

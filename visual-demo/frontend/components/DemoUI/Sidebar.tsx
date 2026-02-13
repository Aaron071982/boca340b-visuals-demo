'use client';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string, endpoint: string, method?: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
  endpoint: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'bi-layout-text-window-reverse', endpoint: '/admin/dashboard' },
  { id: 'total-patients', label: 'Total Patients', icon: 'bi-people', endpoint: '/admin/patients/get' },
  { id: 'new-patients', label: 'New Patients', icon: 'bi-person-plus', endpoint: '/admin/patients/new' },
  { id: 'new-enrollments', label: 'New Enrollments w/ No Rx', icon: 'bi-person-check', endpoint: '/admin/enrollments/no-rx' },
  { id: 'lost-patients', label: 'Lost Patients', icon: 'bi-person-dash', endpoint: '/admin/patients/lost' },
  { id: 'recon-details', label: 'Recon Details', icon: 'bi-bar-chart', endpoint: '/admin/reports/recon' },
  { id: 'transaction-details', label: 'Transaction Details', icon: 'bi-list-ul', endpoint: '/admin/reports/transactiondetails' },
  { id: 'purchases', label: 'Purchases', icon: 'bi-cart', endpoint: '/admin/purchases' },
  { id: 'essentials', label: 'Everyday Essentials', icon: 'bi-box', endpoint: '/admin/essentials' },
  { id: 'savings', label: '340B Savings', icon: 'bi-building', endpoint: '/admin/savings' },
  { id: 'inventory', label: 'Inventory On Hand', icon: 'bi-clipboard-plus', endpoint: '/admin/inventory' },
  { id: 'hrsa', label: 'HRSA Report', icon: 'bi-file-earmark-text', endpoint: '/admin/reports/hrsa' },
  { id: 'shipping', label: 'Shipping Information', icon: 'bi-truck', endpoint: '/admin/facilities/shipping_view_report' },
  { id: 'esp-data', label: 'ESP Data', icon: 'bi-database', endpoint: '/admin/esp/data' },
];

const otherItems: NavItem[] = [
  { id: 'manage-admins', label: 'Manage Admins', icon: 'bi-person-badge', endpoint: '/admin/auth/user' },
  { id: 'settings', label: 'User Settings', icon: 'bi-gear', endpoint: '/admin/settings' },
  { id: 'help', label: 'Help', icon: 'bi-question-circle', endpoint: '/admin/help' },
];

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <div
      className="h-full flex flex-col text-white"
      style={{
        backgroundColor: '#0A3A66',
        width: '240px',
        minWidth: '240px',
        flexShrink: 0,
        fontFamily: 'Roboto, sans-serif',
      }}
    >
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-4 mb-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#a0b4c8' }}>
            NAVIGATION
          </h3>
        </div>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id, item.endpoint, 'GET')}
                  className={`sidebar-nav-item w-full text-left px-4 py-3 flex items-center gap-3 relative rounded-md ${
                    isActive ? 'active' : ''
                  }`}
                  style={{
                    backgroundColor: isActive ? 'rgba(11, 94, 215, 0.15)' : 'transparent',
                    color: '#ffffff',
                    fontFamily: 'Roboto, sans-serif',
                  }}
                >
                  {isActive && (
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1 rounded-r"
                      style={{ backgroundColor: '#0B5ED7' }}
                    />
                  )}
                  <i className={`bi ${item.icon} text-lg ${isActive ? 'text-blue-300' : ''}`}></i>
                  <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Separator */}
        <div className="px-4 my-4">
          <div className="border-t" style={{ borderColor: '#1e3a5f' }}></div>
        </div>

        {/* OTHER Section */}
        <div className="px-4 mb-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#a0b4c8' }}>
            OTHER
          </h3>
        </div>
        <ul className="space-y-1">
          {otherItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id, item.endpoint, 'GET')}
                  className={`sidebar-nav-item w-full text-left px-4 py-3 flex items-center gap-3 relative rounded-md ${
                    isActive ? 'active' : ''
                  }`}
                  style={{
                    backgroundColor: isActive ? 'rgba(11, 94, 215, 0.15)' : 'transparent',
                    color: '#ffffff',
                    fontFamily: 'Roboto, sans-serif',
                  }}
                >
                  {isActive && (
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1 rounded-r"
                      style={{ backgroundColor: '#0B5ED7' }}
                    />
                  )}
                  <i className={`bi ${item.icon} text-lg ${isActive ? 'text-blue-300' : ''}`}></i>
                  <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* User & Logout Section */}
      <div className="p-4 border-t" style={{ borderColor: '#1e3a5f' }}>
        <div className="mb-3">
          <p className="text-sm font-medium text-white" style={{ fontFamily: 'Roboto, sans-serif' }}>Jamal-uddin, Kazi</p>
        </div>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to log out?')) {
              onNavigate('login', '/login', 'GET');
            }
          }}
          className="btn-enhanced w-full px-4 py-2 rounded-md text-sm font-medium text-white"
          style={{ 
            backgroundColor: '#d97706',
            fontFamily: 'Roboto, sans-serif'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

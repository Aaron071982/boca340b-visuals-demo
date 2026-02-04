'use client';

export default function Footer() {
  return (
    <div
      className="w-full py-4 px-6 flex items-center justify-between border-t border-gray-200"
      style={{
        backgroundColor: '#f8f9fa',
        fontFamily: 'Roboto, sans-serif',
      }}
    >
      {/* Left: Copyright */}
      <div className="text-sm" style={{ color: '#73818f' }}>
        Copyright © 2026 Boca Pharmacy All Rights Reserved.
      </div>

      {/* Center: Security Logos */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded" style={{ backgroundColor: '#fff3cd' }}>
          <div className="w-6 h-6 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2L3 6V10C3 14.55 6.36 18.74 10 20C13.64 18.74 17 14.55 17 10V6L10 2Z" fill="#fbbf24" stroke="#92400e" strokeWidth="1"/>
              <path d="M10 10L8 8L10 6L12 8L10 10Z" fill="#92400e"/>
            </svg>
          </div>
          <span className="text-xs font-semibold" style={{ color: '#92400e' }}>Norton SECURED</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded" style={{ backgroundColor: '#dbeafe' }}>
          <div className="w-6 h-6 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2L3 6V10C3 14.55 6.36 18.74 10 20C13.64 18.74 17 14.55 17 10V6L10 2Z" fill="#3b82f6" stroke="#1e40af" strokeWidth="1"/>
              <path d="M7 10L9 12L13 8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xs font-semibold" style={{ color: '#1e40af' }}>HIPAA COMPLIANT</span>
        </div>
      </div>

      {/* Right: Legal Links */}
      <div className="flex items-center gap-3 text-sm">
        <a href="#" className="hover:underline" style={{ color: '#73818f' }}>
          Report an Issue
        </a>
        <a href="#" className="hover:underline" style={{ color: '#73818f' }}>
          Privacy Policy
        </a>
        <a href="#" className="hover:underline" style={{ color: '#73818f' }}>
          Terms & Conditions
        </a>
      </div>
    </div>
  );
}

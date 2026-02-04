'use client';

import { useState } from 'react';

interface LoginFormProps {
  onAction?: (action: string, endpoint: string, method?: string) => void;
}

export default function LoginForm({ onAction }: LoginFormProps) {
  const [inputType, setInputType] = useState<'email' | 'phone'>('email');
  const [inputValue, setInputValue] = useState('aaronsiam21@gmail.com'); // Hardcoded for demo
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'login' | 'verify'>('login');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Normalize input - accept email or the hardcoded password as email
    const normalizedInput = inputValue.toLowerCase().trim();
    if (normalizedInput === 'aaronsiam21@gmail.com' || normalizedInput === '000000' || normalizedInput === '') {
      setInputValue('aaronsiam21@gmail.com');
      onAction?.('send-otp', '/custom-login', 'POST');
      setStep('verify');
      // Auto-fill verification code for demo (in real app, this would come from SMS/email)
      setTimeout(() => {
        setVerificationCode('000000');
      }, 500);
    } else {
      onAction?.('send-otp', '/custom-login', 'POST');
      setStep('verify');
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    // Allow login with hardcoded credentials (000000) or any code for demo
    onAction?.('verify', '/verify', 'POST');
    // Simulate successful login
    alert('Login successful! Redirecting to dashboard...');
    // In a real app, this would redirect to dashboard
    setTimeout(() => {
      setStep('login');
      setInputValue('aaronsiam21@gmail.com');
      setVerificationCode('');
    }, 1000);
  };

  return (
    <div className="h-full w-full flex" style={{ backgroundColor: '#0567ab' }}>
      {/* Left Side - Logo */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="text-center">
          {/* Logo Icon - Using a placeholder SVG */}
          <div className="mb-8">
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto"
            >
              <rect width="120" height="120" rx="20" fill="white" />
              <path
                d="M30 40 L60 20 L90 40 L90 80 L60 100 L30 80 Z"
                fill="#0567ab"
                stroke="#0567ab"
                strokeWidth="2"
              />
              <circle cx="60" cy="60" r="15" fill="white" />
            </svg>
          </div>
          <h1 className="text-6xl font-bold text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            BOCA
          </h1>
          <h2
            className="text-2xl text-white tracking-widest uppercase"
            style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '0.2em' }}
          >
            340B INSIGHTS
          </h2>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <h2
            className="text-3xl font-bold text-gray-800 mb-2 text-center uppercase"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            LOGIN
          </h2>
          <p className="text-sm text-gray-600 mb-6 text-center" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Enter Your Email/Phone Number To Proceed
          </p>
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-xs text-blue-700 text-center" style={{ fontFamily: 'Roboto, sans-serif' }}>
              <strong>Demo Credentials:</strong> aaronsiam21@gmail.com / Verification Code: 000000
            </p>
          </div>

          {step === 'login' ? (
            <form onSubmit={handleLogin}>
              {/* Email/Phone Radio Buttons */}
              <div className="flex gap-6 mb-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="inputType"
                    value="email"
                    checked={inputType === 'email'}
                    onChange={() => setInputType('email')}
                    className="mr-2 w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    Email
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="inputType"
                    value="phone"
                    checked={inputType === 'phone'}
                    onChange={() => setInputType('phone')}
                    className="mr-2 w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    Phone
                  </span>
                </label>
              </div>

              {/* Input Field */}
              <div className="mb-6">
                <input
                  type={inputType === 'email' ? 'email' : 'tel'}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={inputType === 'email' ? 'Enter your email' : 'Enter your phone number'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ fontFamily: 'Roboto, sans-serif', height: '50px' }}
                  required
                />
              </div>

              {/* Terms Text */}
              <div className="mb-6 text-xs text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                <p>
                  By Providing your phone number, you agree to receive text messages from Boca Pharmacy Group.
                  Message and Data rates may apply. Reply HELP for help and STOP to cancel. View our{' '}
                  <a href="#" className="text-blue-600 underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-600 underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>

              {/* Send OTP Button */}
              <button
                type="submit"
                className="w-full text-white uppercase font-semibold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  backgroundColor: '#0567ab',
                  fontFamily: 'Roboto, sans-serif',
                  height: '50px',
                  letterSpacing: '0.05em',
                }}
              >
                Send OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Verification Code
                </label>
                <p className="text-sm text-gray-500 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Enter the verification code sent to your {inputType === 'email' ? 'email' : 'phone'}
                </p>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="123456"
                  style={{ fontFamily: 'Roboto, sans-serif', height: '50px' }}
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('login')}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-400"
                  style={{ fontFamily: 'Roboto, sans-serif', height: '50px' }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 text-white uppercase font-semibold py-3 px-4 rounded-md"
                  style={{
                    backgroundColor: '#0567ab',
                    fontFamily: 'Roboto, sans-serif',
                    height: '50px',
                    letterSpacing: '0.05em',
                  }}
                >
                  Verify
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

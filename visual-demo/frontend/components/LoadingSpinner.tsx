'use client';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ message, size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className="flex items-center justify-center h-full w-full" style={{ backgroundColor: '#ffffff' }}>
      <div className="text-center">
        <div className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-blue-600 mx-auto mb-4`}></div>
        {message && (
          <p className="text-gray-600 text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

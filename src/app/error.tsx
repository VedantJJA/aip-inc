'use client';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="flex flex-col items-center gap-4 max-w-md text-center p-8 glass rounded-2xl">
        <div className="w-16 h-16 bg-rose/10 rounded-full flex items-center justify-center text-rose mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h2 className="text-2xl font-display font-bold text-text-primary">Something went wrong!</h2>
        <p className="text-text-secondary mb-6">We apologize for the inconvenience. An unexpected error has occurred.</p>
        <button
          className="btn-primary"
          onClick={() => reset()}
        >
          Try again
        </button>
      </div>
    </div>
  );
}

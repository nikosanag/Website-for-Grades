'use client';

import { useEffect } from 'react';

export default function ErrorHandler() {
  useEffect(() => {
    // Handle unhandled promise rejections (like browser extension errors)
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Check if this is a browser extension/vendor error
      if (event.reason?.message?.includes('message channel closed') || 
          event.reason?.message?.includes('listener indicated an asynchronous response')) {
        // Suppress these specific browser/extension errors
        event.preventDefault();
        console.warn('[ErrorHandler] Suppressed browser extension error:', event.reason?.message);
        return;
      }
      // Let other errors through normally
    };

    // Add the listener
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null; // This component doesn't render anything
}

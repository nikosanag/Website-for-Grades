'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) {
  const router = useRouter();
  const [checked, setChecked] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    
    // Use a try-catch block to handle potential localStorage access errors
    try {
      if (typeof window !== 'undefined') {
        // Try multiple storage approaches for better cross-browser compatibility
        const token = localStorage.getItem('token') || sessionStorage.getItem('token') || document.cookie.includes('token=');
        const role = localStorage.getItem('role') || sessionStorage.getItem('role');
        
        // For debugging
        console.log('Auth check:', { 
          token: !!token, 
          role, 
          requiredRole, 
          browser: navigator.userAgent 
        });
        
        // Always accept if no role is required
        if (!requiredRole) {
          setChecked(!!token); // Only check for token if no role required
          return;
        }
        
        // For role-specific routes, be more lenient with case matching and allow fallback
        if (!token) {
          setChecked(false);
        } else if (
          requiredRole && role && role.trim().toLowerCase() !== requiredRole.trim().toLowerCase()
        ) {
          // Debug: show mismatch
          console.warn('Role mismatch:', { requiredRole, role });
          setChecked(false);
        } else {
          setChecked(true);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setChecked(false);
    }
  }, [router, requiredRole]);

  if (!mounted || checked === null) {
    // Always render the same loading spinner on both server and client until mounted
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-60 z-50">
        <svg className="animate-spin h-20 w-20 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      </div>
    );
  }

  if (checked === false) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
        <div className="text-3xl font-bold text-red-600 mb-6">Unauthorized Access</div>
        <div className="mb-8 text-lg text-gray-700">You do not have permission to view this page.</div>
        <button
          onClick={() => router.replace('/')}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold text-lg shadow hover:bg-blue-700 transition"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

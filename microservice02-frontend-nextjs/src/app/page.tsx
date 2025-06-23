'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TextInput } from '@/app/ui/inputs/TextInput';
import { Button } from '@/app/ui/common/Button';
import Image from 'next/image';
import { loginWithMicroservice } from '@/app/lib/auth';

export default function LandingPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const matrixContainer = document.querySelector('.matrix-background');
    if (!matrixContainer) return;

    const createRainDrop = () => {
      const element = document.createElement('div');
      element.className = 'matrix-rain';
      element.textContent = Math.random() < 0.5 ? '0' : '1';
      element.style.left = `${Math.random() * 98}%`;
      element.style.animationDuration = `${3.5 + Math.random() * 1.5}s`;
      element.style.opacity = `${0.6 + Math.random() * 0.4}`;
      matrixContainer.appendChild(element);

      setTimeout(() => {
        element.remove();
      }, 5000);
    };

    // Create initial raindrops with fewer drops
    const numDrops = 80; // Reduced from 150 for lighter effect
    const createInitialRain = () => {
      for (let i = 0; i < numDrops; i++) {
        setTimeout(createRainDrop, Math.random() * 2000);
      }
    };

    createInitialRain();

    // Slower intervals for new drops
    const interval = setInterval(createRainDrop, 80); // Increased from 45 to 80ms

    // Create additional streams of drops with slower intervals
    const additionalIntervals = [
      setInterval(createRainDrop, 120), // Increased from 55 to 120ms
      setInterval(createRainDrop, 160)  // Increased from 65 to 160ms
    ];

    return () => {
      clearInterval(interval);
      additionalIntervals.forEach(clearInterval);
      while (matrixContainer.firstChild) {
        matrixContainer.removeChild(matrixContainer.firstChild);
      }
    };
  }, []);
  async function handleLogin() {
    setMessage('');
    const result = await loginWithMicroservice(username, password);
    if (result.error) {
      setMessage('❌ ' + result.error);
      return;
    }
    if (!result.role || !result.token) {
      setMessage('❌ Login failed');
      return;
    }    // Standardize role to lowercase to prevent case sensitivity issues
    const normalizedRole = result.role.toLowerCase();
    
    // Store in multiple locations to improve cross-browser compatibility
    try {
      // Store in localStorage (primary)
      localStorage.setItem('logged_in', 'true');
      localStorage.setItem('token', result.token);
      localStorage.setItem('role', normalizedRole);
      
      // Backup in sessionStorage (for browsers with localStorage restrictions)
      sessionStorage.setItem('logged_in', 'true');
      sessionStorage.setItem('token', result.token);
      sessionStorage.setItem('role', normalizedRole);
      
      // Set a cookie as fallback (7 day expiration)
      document.cookie = `token=${result.token};path=/;max-age=${60*60*24*7}`;
      document.cookie = `role=${normalizedRole};path=/;max-age=${60*60*24*7}`;
    } catch (error) {
      console.error('Error storing auth data:', error);
      // If localStorage fails, try sessionStorage
      try {
        sessionStorage.setItem('token', result.token);
        sessionStorage.setItem('role', normalizedRole);
      } catch {
        // Last resort - do nothing, the cookie should still work
      }
    }
    
    setMessage(`✅ Logged in as ${result.role}`);
    setTimeout(() => {
      router.replace(`/dashboard/${normalizedRole}`);
    }, 1000);
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-8 animate-fadeIn relative">
      <div className="matrix-background" />
      <div className="max-w-[1000px] w-full flex rounded-4xl overflow-hidden h-[700px] animate-slideUp shadow-2xl relative z-10">
        {/* Left side - Image */}
        <div className="w-1/2 hidden md:block relative overflow-hidden bg-white">
          <Image
            src="/sky-background.jpg"
            alt="Sky background"
            fill
            className="object-cover animate-unroll"
            priority
          />
        </div>

        {/* Right side - Login Form */}
        <div className="w-full md:w-1/2 bg-white p-8 transition-all duration-500 hover:shadow-2xl animate-slideRight">
          <div className="relative z-10">
            <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-8 animate-[fadeInUp_0.8s_ease-out] hover:scale-105 transition-transform duration-300">
              Welcome to clearSKY
            </h1>

            <div className="bg-white/95 p-8 rounded-2xl shadow-inner border border-gray-200 transition-all duration-300 hover:border-blue-500 hover:shadow-lg backdrop-blur-sm">
              <p className="text-lg font-medium text-gray-800 mb-6 text-center transition-opacity duration-300 hover:opacity-80">
                Please enter your credentials
              </p>

              <form 
                className="space-y-6" 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
              >
                <TextInput
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 rounded-xl border text-gray-900 bg-gray-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 transform hover:scale-[1.02]"
                />
                <TextInput
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-xl border text-gray-900 bg-gray-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 transform hover:scale-[1.02]"
                />

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl transition-all duration-300 hover:opacity-90 hover:transform hover:scale-105"
                  >
                    Login
                  </Button>
                </div>
              </form>
            </div>

            <div
              className={`mt-6 p-4 rounded-xl text-center  font-medium transition-all duration-2000 ${
                message.includes('❌')
                  ? 'bg-red-100 text-red-700 animate-shake'
                  : message.includes('✅')
                  ? 'bg-green-100 text-green-700 animate-bounce'
                  : 'bg-white-50 text-gray-700'
              }`}
            >
              {message && message}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
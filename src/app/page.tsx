'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { users } from '@/app/lib/users';
import { TextInput } from '@/app/ui/inputs/TextInput';
import { Button } from '@/app/ui/common/Button';
import Image from 'next/image';

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
    const numDrops = 150; 
    const createInitialRain = () => {
      for (let i = 0; i < numDrops; i++) {
        setTimeout(createRainDrop, Math.random() * 2000);
      }
    };

    createInitialRain();

    // Slower intervals for new drops
    const interval = setInterval(createRainDrop, 45); // Increased from 35 to 45ms

    // Create additional streams of drops with slower intervals
    const additionalIntervals = [
      setInterval(createRainDrop, 55), // Increased from 40 to 55ms
      setInterval(createRainDrop, 65)  // Increased from 45 to 65ms
    ];

    return () => {
      clearInterval(interval);
      additionalIntervals.forEach(clearInterval);
      while (matrixContainer.firstChild) {
        matrixContainer.removeChild(matrixContainer.firstChild);
      }
    };
  }, []);

  function handleLogin() {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      setMessage('❌ Invalid username or password');
      return;
    } else {
      localStorage.setItem('logged_in', 'true');
    }

    setMessage(`✅ Logged in as ${user.role}`);
    setTimeout(() => {
      router.push(`/dashboard/${user.role}`);
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

              <div className="space-y-6">
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
                    onClick={handleLogin}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl transition-all duration-300 hover:opacity-90 hover:transform hover:scale-105"
                  >
                    Login
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-2 border-blue-600 text-blue-600 font-bold py-3 rounded-xl transition-all duration-300 hover:bg-blue-50 hover:transform hover:scale-105"
                  >
                    Login with Google
                  </Button>
                </div>
              </div>
            </div>

            <div
              className={`mt-6 p-4 rounded-xl text-center font-medium transition-all duration-300 ${
                message.includes('❌')
                  ? 'bg-red-100 text-red-700 animate-shake'
                  : message.includes('✅')
                  ? 'bg-green-100 text-green-700 animate-bounce'
                  : 'bg-gray-50 text-gray-700'
              }`}
            >
              {message || 'Message area'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
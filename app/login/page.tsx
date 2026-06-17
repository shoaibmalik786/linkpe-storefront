'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-200px)] w-full flex flex-col lg:flex-row overflow-hidden bg-white">
        
        {/* LEFT COLUMN: Branding & Image */}
        <div className="w-full lg:w-1/2 bg-[#faecd6] p-8 md:p-12 lg:p-16 flex flex-col justify-between relative min-h-[500px]">
          
          {/* Header Content */}
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-2">Login</h1>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Link href="/" className="hover:text-black transition-colors">Home</Link>
              <span>&gt;</span>
              <span className="text-black">Login</span>
            </div>
          </div>

          {/* Arch Image Container */}
          <div className="mt-12 w-full max-w-[380px] mx-auto aspect-[4/5] bg-white rounded-t-[200px] overflow-hidden relative z-10 shadow-sm flex items-end justify-center">
            {/* Replace this src with your actual cut-out model image */}
            <img 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop" 
              alt="Fashion Model" 
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Form */}
        <div className="w-full lg:w-1/2 bg-[#fdfdfd] p-4 sm:p-8 md:p-12 flex items-center justify-center">
          
          {/* Login Card */}
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-[2rem] p-8 md:p-10 shadow-sm">
            
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-brand-dark mb-2">Login</h2>
              <p className="text-sm text-gray-500 font-medium">welcome please login to your account</p>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              
              {/* Email Field */}
              <div>
                <label className="block text-sm font-extrabold text-brand-dark mb-2">
                  Email Address
                </label>
                <input 
                  type="email" 
                  placeholder="Email Address"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black transition-colors text-sm font-medium bg-white"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-extrabold text-brand-dark mb-2">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black transition-colors text-sm font-medium bg-white pr-12"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-gray-400 hover:text-black transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 accent-black cursor-pointer" 
                  />
                  <span className="text-sm font-bold text-gray-600">Remember Me</span>
                </label>
                
                <Link href="#" className="text-sm font-bold text-[#ec003f] hover:underline transition-all">
                  Forgot Password
                </Link>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4">
                <button 
                  type="submit"
                  className="flex-1 bg-black text-white py-3.5 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors shadow-md"
                >
                  SIGN IN
                </button>
                <Link 
                  href="/register"
                  className="flex-1 text-center bg-white border border-gray-300 text-brand-dark py-3.5 rounded-lg font-bold text-sm hover:border-black transition-colors"
                >
                  REGISTER
                </Link>
              </div>

            </form>
          </div>

        </div>
        
      </main>
      <Footer />
    </>
  );
}
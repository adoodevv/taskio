'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from "react-icons/fa";
import { useAuth } from '@/context/AuthContext';

const Auth = () => {
   const router = useRouter();
   const { signIn, signUp, isAuthenticated, isLoading } = useAuth();

   const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
   const [userRole, setUserRole] = useState<'seeker' | 'taskio'>('seeker');

   const [signInForm, setSignInForm] = useState({
      email: '',
      password: '',
   });

   const [signUpForm, setSignUpForm] = useState({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
   });

   const [error, setError] = useState('');
   const [success, setSuccess] = useState('');

   // Redirect if already authenticated
   useEffect(() => {
      if (isAuthenticated && !isLoading) {
         router.push('/');
      }
   }, [isAuthenticated, isLoading, router]);

   const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSignInForm({ ...signInForm, [e.target.name]: e.target.value });
      setError('');
      setSuccess('');
   };

   const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSignUpForm({ ...signUpForm, [e.target.name]: e.target.value });
      setError('');
      setSuccess('');
   };

   const handleSignIn = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!signInForm.email || !signInForm.password) {
         setError('Please fill in all fields.');
         return;
      }

      try {
         await signIn(signInForm);
         setSignInForm({ email: '', password: '' });
         router.push('/');
      } catch (error) {
         setError('Invalid email or password.');
      }
   };

   const handleSignUp = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!signUpForm.name || !signUpForm.email || !signUpForm.password || !signUpForm.confirmPassword) {
         setError('Please fill in all fields.');
         return;
      }
      if (signUpForm.password !== signUpForm.confirmPassword) {
         setError('Passwords do not match.');
         return;
      }
      if (signUpForm.password.length < 6) {
         setError('Password must be at least 6 characters long.');
         return;
      }

      try {
         await signUp({
            name: signUpForm.name,
            email: signUpForm.email,
            password: signUpForm.password,
            role: userRole,
         });
         setSignUpForm({ name: '', email: '', password: '', confirmPassword: '' });
         router.push('/');
      } catch (error) {
         setError('Failed to create account. Please try again.');
      }
   };

   // Show loading state
   if (isLoading) {
      return (
         <div className='relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-16'>
            <div className="absolute inset-0 bg-[url(/auth.jpg)] bg-cover bg-center bg-no-repeat">
               <div className="absolute inset-0 bg-black/50" />
            </div>
            <div className="z-10 text-white text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
               <p>Loading...</p>
            </div>
         </div>
      );
   }

   return (
      <div className='relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-16'>
         <div className="absolute top-6 left-6 z-20">
            <Link href="/" className="group inline-flex items-center text-white font-semibold text-sm md:text-base">
               <FaArrowLeft className='mr-2 group-hover:-translate-x-1 transition-all duration-300' />
               <p>Return Home</p>
            </Link>
         </div>
         <div className="absolute inset-0 bg-[url(/auth.jpg)] bg-cover bg-center bg-no-repeat">
            <div className="absolute inset-0 bg-black/50" />
         </div>
         <div className="z-10 max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
               <button
                  onClick={() => setActiveTab('signin')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'signin'
                     ? 'bg-white text-sky-900 shadow-sm'
                     : 'text-gray-600 hover:text-gray-900'
                     }`}
               >
                  Sign In
               </button>
               <button
                  onClick={() => setActiveTab('signup')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'signup'
                     ? 'bg-white text-sky-900 shadow-sm'
                     : 'text-gray-600 hover:text-gray-900'
                     }`}
               >
                  Sign Up
               </button>
            </div>

            {/* Sign In Tab */}
            {activeTab === 'signin' && (
               <div>
                  <div>
                     <h2 className="mt-2 text-center text-3xl font-extrabold text-sky-900">Welcome back</h2>
                     <p className="mt-2 text-center text-sm text-gray-600">Sign in to your account</p>
                  </div>
                  <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
                     <div className="space-y-4">
                        <div>
                           <label htmlFor="signin-email" className="block text-sm font-medium text-gray-700">Email address</label>
                           <input
                              id="signin-email"
                              name="email"
                              type="email"
                              autoComplete="email"
                              required
                              value={signInForm.email}
                              onChange={handleSignInChange}
                              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
                              placeholder="you@email.com"
                           />
                        </div>
                        <div>
                           <label htmlFor="signin-password" className="block text-sm font-medium text-gray-700">Password</label>
                           <input
                              id="signin-password"
                              name="password"
                              type="password"
                              autoComplete="current-password"
                              required
                              value={signInForm.password}
                              onChange={handleSignInChange}
                              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
                              placeholder="Password"
                           />
                        </div>
                     </div>
                     {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
                     {success && <p className="text-green-600 text-sm text-center mt-2">{success}</p>}
                     <div>
                        <button
                           type="submit"
                           className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-900 hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition"
                        >
                           Sign In
                        </button>
                     </div>
                  </form>
                  <div className="mt-4">
                     <p className="text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <button
                           onClick={() => setActiveTab('signup')}
                           className="font-medium text-sky-900 hover:underline"
                        >
                           Sign up
                        </button>
                     </p>
                  </div>
               </div>
            )}

            {/* Sign Up Tab */}
            {activeTab === 'signup' && (
               <div>
                  <div>
                     <h2 className="mt-2 text-center text-3xl font-extrabold text-sky-900">Create your account</h2>
                     <p className="mt-2 text-center text-sm text-gray-600">Sign up to get started</p>
                  </div>

                  {/* Role Selection */}
                  <div className="mt-6">
                     <label className="block text-sm font-medium text-gray-700 mb-3">I want to sign up as:</label>
                     <div className="grid grid-cols-2 gap-3">
                        <button
                           type="button"
                           onClick={() => setUserRole('seeker')}
                           className={`p-4 rounded-lg border-2 transition-all duration-200 ${userRole === 'seeker'
                              ? 'border-sky-500 bg-sky-50 text-sky-900'
                              : 'border-gray-200 hover:border-gray-300'
                              }`}
                        >
                           <div className="text-center">
                              <div className="text-lg font-semibold">Service Seeker</div>
                              <div className="text-xs text-gray-600 mt-1">Find and hire services</div>
                           </div>
                        </button>
                        <button
                           type="button"
                           onClick={() => setUserRole('taskio')}
                           className={`p-4 rounded-lg border-2 transition-all duration-200 ${userRole === 'taskio'
                              ? 'border-sky-500 bg-sky-50 text-sky-900'
                              : 'border-gray-200 hover:border-gray-300'
                              }`}
                        >
                           <div className="text-center">
                              <div className="text-lg font-semibold">Taskio</div>
                              <div className="text-xs text-gray-600 mt-1">Provide services</div>
                           </div>
                        </button>
                     </div>
                  </div>

                  <form className="mt-6 space-y-6" onSubmit={handleSignUp}>
                     <div className="space-y-4">
                        <div>
                           <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                           <input
                              id="name"
                              name="name"
                              type="text"
                              autoComplete="name"
                              required
                              value={signUpForm.name}
                              onChange={handleSignUpChange}
                              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
                              placeholder="Your full name"
                           />
                        </div>
                        <div>
                           <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                           <input
                              id="email"
                              name="email"
                              type="email"
                              autoComplete="email"
                              required
                              value={signUpForm.email}
                              onChange={handleSignUpChange}
                              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
                              placeholder="you@email.com"
                           />
                        </div>
                        <div>
                           <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                           <input
                              id="password"
                              name="password"
                              type="password"
                              autoComplete="new-password"
                              required
                              value={signUpForm.password}
                              onChange={handleSignUpChange}
                              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
                              placeholder="Password"
                           />
                        </div>
                        <div>
                           <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                           <input
                              id="confirmPassword"
                              name="confirmPassword"
                              type="password"
                              autoComplete="new-password"
                              required
                              value={signUpForm.confirmPassword}
                              onChange={handleSignUpChange}
                              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
                              placeholder="Confirm Password"
                           />
                        </div>
                     </div>
                     {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
                     {success && <p className="text-green-600 text-sm text-center mt-2">{success}</p>}
                     <div>
                        <button
                           type="submit"
                           className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-900 hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition"
                        >
                           Sign Up as {userRole === 'seeker' ? 'Service Seeker' : 'Taskio'}
                        </button>
                     </div>
                  </form>
                  <div className="mt-4">
                     <p className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <button
                           onClick={() => setActiveTab('signin')}
                           className="font-medium text-sky-900 hover:underline"
                        >
                           Sign in
                        </button>
                     </p>
                  </div>
               </div>
            )}

            <div>
               <p className='text-center text-sm text-gray-600'>
                  By continuing, you agree to our <a href="/terms" className="font-medium text-sky-900 hover:underline">Terms of Service</a> and <a href="/privacy" className="font-medium text-sky-900 hover:underline">Privacy Policy</a>
               </p>
            </div>
         </div>
      </div>
   );
};

export default Auth;

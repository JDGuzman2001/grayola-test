"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext/userContext';

export default function LoginPage() {
  const { email, setEmail, password, setPassword, user, loading, handleSignIn, handleSignInWithGoogle } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      // router.push('/user-type');
      router.push('/loading');
    }
    
  }, [user, router]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  const redirectToSignUp = () => {
    router.push('/signup');
  };

  return (
    <main className="h-screen flex flex-col items-center justify-center bg-cyan-200 p-6">
      <img src="/GrayolaIcon.svg" alt="GrayolaIcon" className="w-40 h-40" />
      <div className="bg-gray-200 p-6 rounded-lg shadow-md w-96">
        {/* <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="mb-4 w-full p-3 rounded-md border border-gray-100 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mb-4 w-full p-3 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <Button
          onClick={handleSignIn}
          className="w-full p-3 bg-green-400 text-black hover:bg-white border border-black mb-2"
        >
          Sign In
        </Button>
        <p className="text-center text-gray-700">or</p>
        <Button
          onClick={redirectToSignUp}
          className="w-full p-3 bg-fuchsia-400 text-black hover:bg-white border border-black mt-2"
        >
          Sign Up
        </Button> */}
        <img src="/Google_Logo.svg" alt="GrayolaIcon" className="w-48 h-48 mx-auto filter mb-6" />
        <Button
          onClick={handleSignInWithGoogle}
          className="w-full p-3 bg-green-400 text-black hover:bg-fuchsia-400 border border-black mb-2"
        >
          Sign In with Google
        </Button>
      </div>
    </main>
  );
}

"use client";

import { createClient } from "@/supabase/client";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: {user},
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  });

  const handleSignUp = async () => {
    const res = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    setUser(res?.data?.user);
    router.refresh();
    setEmail("");
    setPassword("");
  };

  const handleSignIn = async () => {
    const res = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setUser(res?.data?.user);
    router.refresh();
    setEmail("");
    setPassword("");
  };

  const handleLogout = async () => {
    const {error} = await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  };

  // const handleSignInWithGoogle = async () => {
  //   const res = await supabase.auth.signInWithOAuth({
  //     provider: "google",
  //     options: {
  //       queryParams: {
  //         access_type: "offline",
  //         prompt: "consent",
  //       },
  //       redirectTo: `${location.origin}/auth/callback`,
  //     },
  //   });
  // };

  if (user) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md w-96 text-center">
          <h1 className="mb-4 text-xl font-bold text-blue-700 dark:text-gray-300">
            You&apos;re logged in
          </h1>
          <button
            onClick={handleLogout}
            className="w-full p-3 rounded-md bg-red-400 text-white hover:bg-red-600 focus:outline-none"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <h1>loading..</h1>;
  }

  return (
    <main className="h-screen flex flex-col items-center justify-center bg-cyan-200 p-6">
      <img src="/GrayolaIcon.svg" alt="GrayolaIcon" className="w-40 h-40" />
      <div className="bg-gray-200 p-8 rounded-lg shadow-md w-96">
        <input
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
        <button
          onClick={handleSignUp}
          className="w-full mb-2 p-3 rounded-md bg-blue-950 text-white hover:bg-blue-700 focus:outline-none"
        >
          Sign Up
        </button>
        <button
          onClick={handleSignIn}
          className="w-full p-3 rounded-md bg-gray-700 text-white hover:bg-gray-600 focus:outline-none"
        >
          Sign In
        </button>
        {/* <button
          onClick={handleSignInWithGoogle}
          className="w-full mt-2 p-3 rounded-md bg-gray-700 text-white hover:bg-gray-600 focus:outline-none"
        >
          Sign In with google
        </button> */}
      </div>
    </main>
  );
}
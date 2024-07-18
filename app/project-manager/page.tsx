"use client";

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from "@/supabase/client";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import { useUser } from '@/context/UserContext/userContext';
 

export default function UserType() {
  const { email, setUser, setEmail, password, setPassword, user, loading, handleSignUp, handleSignIn } = useUser();
  const supabase = createClient();
  const button_class = "bg-green-400 text-black hover:bg-fuchsia-400 border border-black"
  const router = useRouter();


  const handleLogout = async () => {
    const {error} = await supabase.auth.signOut();
    setUser(null);
    router.refresh();
    router.push('/login');
  };

  return (    
    <main className="flex flex-col items-center justify-center min-h-screen bg-cyan-200">
      <img src="/GrayolaIcon.svg" alt="GrayolaIcon" className="w-40 h-40" />
      <div className="flex space-x-4">
        {/* <Button className={button_class}>Cliente</Button> */}
        <Button className={button_class}>Project Manager</Button>
        {/* <Button className={button_class}>Diseñador</Button> */}
      </div>
      <footer className="">
      <Button
        onClick={handleLogout}
        variant="destructive"
        className="mt-24"
        >
        Logout
      </Button>
      </footer>
    </main>
  );
}

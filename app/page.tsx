"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext/userContext';
import { createClient } from "@/supabase/client";
import * as React from "react";

export default function LoginPage() {
  const { user, handleSignInWithGoogle } = useUser();
  const router = useRouter();
  const supabase = createClient();
  const [loadingPage, setLoadingPage] = React.useState(true);

  React.useEffect(() => {
    const checkUser = async () => {
        if (user) {
            try {
                const { data, error } = await supabase.from('users').select().eq('email', user.email).single();
                
                if (error) {
                    router.replace('/login');
                    return;
                }
                
                if (data) {
                  console.log(data);
                    if (data.role === 'Project Manager') {
                        router.replace('/project-manager');
                    } else if (data.role === 'Client') {
                        router.replace('/project-manager');
                    } else if (data.role === 'Designer') {
                        router.replace('/designer');
                    }
                } else {
                    setLoadingPage(false);
                    console.log('No user data found');
                }
            } catch (error) {
                router.replace('/login');
            }
        } else {
            setLoadingPage(false);
        }
    };
      checkUser();
  }, [user, router, supabase]);

  if (loadingPage) {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <img src="/GrayolaIcon.svg" alt="GrayolaIcon" className="w-40 h-40" />
            <span>Loading...</span>
        </div>
    );
  }
  return (
    <main className="h-screen flex flex-col items-center justify-center bg-cyan-200 p-6">
      <img src="/GrayolaIcon.svg" alt="GrayolaIcon" className="w-40 h-40" />
      <div className="bg-gray-200 p-6 rounded-lg shadow-md w-96">
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



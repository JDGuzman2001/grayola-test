"use client"

import * as React from "react"

import { Progress } from "@/components/ui/progress"
import { useUser } from '@/context/UserContext/userContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
// import { useRouter } from 'next/router'; 
import { createClient } from "@/supabase/client";
import { set } from "zod";

export default function LoadingRegisterPage() {
  const supabase = createClient();
  const {  user } = useUser();
  const [progress, setProgress] = React.useState(13)
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();
  const [route, setRoute] = React.useState('');


    React.useEffect(() => {
        const timer = setTimeout(() => {
        setProgress(100);
        setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    React.useEffect(() => {
        const checkUser = async () => {
            if (user) {
                console.log('User:', user);
                console.log('User Email:', user.email);
                const {data,  error} = await supabase.from('users').select().eq('email', user.email).single();

                if (error) {
                    console.error('Error fetching user:', error.message);
                    setRoute('/signup');
                }

                if (data) {
                  if (data.role === 'Client') {
                    setRoute('/client');
                  } else if (data.role === 'Project Manager') {
                    setRoute('/project-manager');
                  } else if (data.role === 'Designer') {
                    setRoute('/designer');
                  }
                } else {
                    setRoute('/signup');
                }
            }
        };

        checkUser();
    }, [user, router]);

    const redirectToDashboard = () => {
        // handleSignInWithGoogle();
        router.push(route);
      };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-cyan-200 p-6">
      <img src="/GrayolaIcon.svg" alt="GrayolaIcon" className="w-40 h-40" />
      <Progress value={progress} className="w-[100%]" />
      {isLoading ? null : (
        <Button
          onClick={redirectToDashboard} 
          className=" p-3 bg-green-400 text-black hover:bg-fuchsia-400 border border-black mt-2"
        >
          Continuar
        </Button>
      )}
    </div>
  )
}





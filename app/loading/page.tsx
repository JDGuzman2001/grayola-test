"use client"

import * as React from "react"
import { Progress } from "@/components/ui/progress"
import { useUser } from '@/context/UserContext/userContext';
import { useRouter } from 'next/navigation';
import { createClient } from "@/supabase/client";

export default function LoadingRegisterPage() {
  const supabase = createClient();
  const { user } = useUser();
  const [progress, setProgress] = React.useState(13);
  const [isLoading, setIsLoading] = React.useState(true);
  const [redirectTo, setRedirectTo] = React.useState('');
  const router = useRouter();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (progress === 100 && !isLoading) {
      const checkUser = async () => {
        if (user) {
          const { data, error } = await supabase.from('users').select().eq('email', user.email).single();
          if (error) {
            console.error('Error fetching user in Loading:', error.message);
            setRedirectTo('/signup');
          } else if (data) {
            if (data.role === 'Client') {
              setRedirectTo('/client');
            } else if (data.role === 'Project Manager') {
              setRedirectTo('/project-manager');
            } else if (data.role === 'Designer') {
              setRedirectTo('/designer');
            }
          } else {
            setRedirectTo('/signup');
          }
        }
      };

      checkUser();
    }
  }, [progress, isLoading, user, router, supabase]);

  React.useEffect(() => {
    if (redirectTo) {
      router.push(redirectTo);
    }
  }, [redirectTo, router]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-cyan-200 p-6">
      <img src="/GrayolaIcon.svg" alt="GrayolaIcon" className="w-40 h-40" />
      <Progress value={progress} className="w-[100%]" />
    </div>
  )
}


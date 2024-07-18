"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/supabase/client';

interface UserContextType {
  user: any;
  setUser: (user: any) => void;
  loading: boolean;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleSignUp: () => void;
  handleSignIn: () => void;
  handleSignInWithGoogle: () => void;
  getProjects: () => void;
  projects: any;
  setProjects: (projects: any) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any>(null);
 

  const supabase = createClient();


  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, [supabase]);

  const handleSignUp = async () => {
    const res = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    console.log(res);
    setUser(res?.data?.user);
    setEmail('');
    setPassword('');
  };

  const handleSignIn = async () => {
    const res = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log(res);
    setUser(res?.data?.user);
    setEmail('');
    setPassword('');
  };


  const handleSignInWithGoogle = async () => {
    const res = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
        redirectTo: `${location.origin}/loading-register`,
      },
    });

    console.log(res);
  };

  const getProjects = async () => {
    const { data: projects, error } = await supabase.from('projects').select().filter('email', 'eq', user.email);
    if (error) {
      console.error('Error fetching projects:', error.message);
      return;
    }
    console.log(projects);
    setProjects(projects);
  }

  return (
    <UserContext.Provider
      value={{ user, setUser, loading, email, setEmail, password, setPassword, handleSignUp, handleSignIn, handleSignInWithGoogle, getProjects, projects, setProjects }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

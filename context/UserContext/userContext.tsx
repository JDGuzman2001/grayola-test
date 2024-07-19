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
  allProjects: any;
  setAllProjects: (allProjects: any) => void;
  getAllProjects: () => void;
  getUnassignedProjects: () => void;
  unassignedProjects: any;
  setUnassignedProjects: (unassignedProjects: any) => void;
  assignedProjects: any;
  setAssignedProjects: (assignedProjects: any) => void;
  designerProjects: any;
  setDesignerProjects: (designerProjects: any) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any>(null);
  const [allProjects, setAllProjects] = useState<any>(null);
  const [assignedProjects, setAssignedProjects] = useState<any>(null);
  const [designerProjects, setDesignerProjects] = useState<any>(null);
  const [unassignedProjects, setUnassignedProjects] = useState<any>(null);
 

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

  // Handles user registration.
  const handleSignUp = async () => {
    const res = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    setUser(res?.data?.user);
    setEmail('');
    setPassword('');
  };

  // Handles user login with email and password.
  const handleSignIn = async () => {
    const res = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setUser(res?.data?.user);
    setEmail('');
    setPassword('');
  };

  // Handle login with Google.
  const handleSignInWithGoogle = async () => {
    const res = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
        redirectTo: `https://grayola-test.vercel.app/loading`,
      },
    });
  };

  // Gets the authenticated user's projects.
  const getProjects = async () => {
    const { data: projects, error } = await supabase.from('projects').select().filter('email', 'eq', user.email);
    if (error) {
      return;
    }
    setProjects(projects);
  }

  // Gets all projects.
  const getAllProjects = async () => {
    const { data: allProjects, error } = await supabase.from('projects').select();
    if (error) {
      return;
    }
    setAllProjects(allProjects);
  }

  // Gets unassigned projects.
  const getUnassignedProjects = async () => {
    const { data: unassignedProjects, error } = await supabase.from('projects').select().eq('state', 'Pending');
    if (error) {
      return;
    }
    setUnassignedProjects(unassignedProjects);
  }

  return (
    <UserContext.Provider
      value={{ user, setUser, loading, email, setEmail, password, setPassword, handleSignUp, handleSignIn, handleSignInWithGoogle, getProjects, projects, setProjects, allProjects, setAllProjects , getAllProjects, assignedProjects, setAssignedProjects, designerProjects, setDesignerProjects, getUnassignedProjects, unassignedProjects, setUnassignedProjects }}
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

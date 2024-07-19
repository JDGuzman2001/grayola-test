"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext/userContext"; // Ajusta la ruta si es necesario
import DesignerClient from "@/components/designerclient";
import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";

export default function Designer() {
  const [designerProjects, setDesignerProjects] = useState<any>([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const { user, setUser, projects, getProjects } = useUser();
  const supabase = createClient();
  const router = useRouter();
  React.useEffect(() => {
    const checkUser = async () => {
        if (user) {
            try {
                const { data, error } = await supabase.from('users').select().eq('email', user.email).single();
                
                if (error) {
                    console.error('Error fetching user:', error.message);
                    router.replace('/login');
                    return;
                }
                
                if (data) {
                    if (data.role === 'Project Manager') {
                        router.replace('/project-manager');
                    } else if (data.role === 'Client') {
                        router.replace('/client');// Stop loading if Clien
                    } else if (data.role === 'Designer') {
                        setLoadingPage(false);
                    }
                } else {
                    console.log('No user data found');
                }
            } catch (error) {
                // console.error('Error during user check:', error.message);
                router.replace('/login');
            }
        }
    };

    checkUser();
}, [user, router, supabase]);
  useEffect(() => {
    if (user) {
      const fetchProjects = async () => {
        try {
          const supabase = createClient();
          const { data: userdata, error: userdataError } = await supabase
            .from('users')
            .select()
            .eq('email', user.email)
            .single();
            
          if (userdataError) throw userdataError;

          const { data: projectsData, error: projectsError } = await supabase
            .from('projects')
            .select()
            .eq('designer', userdata.id);
          
          if (projectsError) throw projectsError;

          setDesignerProjects(projectsData || []);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchProjects();
    }
  }, [user]);

  if (loadingPage) {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <img src="/GrayolaIcon.svg" alt="GrayolaIcon" className="w-40 h-40" />
            <span>Loading...</span>
        </div>
    );
}

  return (
    <DesignerClient projects={designerProjects} />
  );
}

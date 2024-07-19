"use client";

import * as React from "react";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";
import { useUser } from '@/context/UserContext/userContext';
import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar";
import ProjectCard from "@/components/project-card";
import Link from 'next/link';

interface Project {
    id: number;
    title: string;
    description: string;
    state: string;
    images: string[];
    email: string;
    // Add other properties specific to your project data
}

const initialState = {
    message: '',
    errors: null,
};

export default function UserType() {
    const { user, setUser, allProjects, getAllProjects } = useUser();
    const supabase = createClient();
    const router = useRouter();
    const [showProjects, setShowProjects] = useState(false);
    const [loading, setLoading] = useState(true);  // Start with loading true

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
                            setLoading(false); // Stop loading if Project Manager
                        } else if (data.role === 'Client') {
                            router.replace('/client');
                        } else if (data.role === 'Designer') {
                            router.replace('/designer');
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

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        router.push('/login');
    };

    const button_class = "bg-green-400 text-black hover:bg-fuchsia-400 border border-black";

    const handleViewProjects = async () => {
        setShowProjects(true);
        setLoading(true);
        await getAllProjects();
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <img src="/GrayolaIcon.svg" alt="GrayolaIcon" className="w-40 h-40" />
                <span>Loading...</span>
            </div>
        );
    }

    return (
        <div>
            <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md flex justify-between items-center px-4 py-2">
                <Menubar>
                    <MenubarMenu>
                        <MenubarTrigger onClick={handleViewProjects}>View All Projects</MenubarTrigger>
                    </MenubarMenu>
                    <Link href={`/assign`}>
                      <MenubarMenu>
                          <MenubarTrigger>Assign</MenubarTrigger>
                      </MenubarMenu>
                    </Link>
                    
                </Menubar>
                
                <Button onClick={handleLogout} className="ml-auto" variant="destructive">
                    Logout
                </Button>
            </div>
            <main className="flex flex-col items-center justify-center min-h-screen bg-cyan-200 pt-16">
                {!showProjects && (
                    <div className="flex flex-col items-center justify-center">
                        <img src="/GrayolaIcon.svg" alt="GrayolaIcon" className="w-40 h-40" />
                        <span className="text-4xl font-bold">Welcome</span>
                        <span className="text-lg mb-5">Click on a project to modify or assign it</span>
                        <Menubar>
                            <MenubarMenu>
                                <MenubarTrigger onClick={handleViewProjects}>View All Projects</MenubarTrigger>
                            </MenubarMenu>
                        </Menubar>
                    </div>
                )}
                {showProjects && (
                    <div className="mx-10 flex flex-wrap gap-2">
                        {!allProjects || allProjects.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <img src="/GrayolaIcon.svg" alt="GrayolaIcon" className="w-40 h-40" />
                                <h1>You don't have projects yet</h1>
                            </div>
                        ) : (
                            allProjects.map((project: Project) => (
                                <ProjectCard key={`${project.id}-${project.title}`} {...project} />
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}


  

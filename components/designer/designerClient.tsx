"use client";

import React from 'react';
import ProjectCard from "@/components/designer/designerCard";
import LogoutButton from "@/components/logoutButton";
import { useRouter } from 'next/navigation';

interface AssignedProject {
  id: number;
  title: string;
  description: string;
  state: string;
  images: string[];
  email: string;
}

const DesignerClient: React.FC<{  projects: any[] }> = ({ projects }) => {
  const router = useRouter(); 
  
  return (
    <main className="bg-cyan-200">
        <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md flex justify-between items-center px-4 py-2">
            <img src="/GrayolaIcon.svg" alt="GrayolaIcon" className="size-10" />
            <div className="flex-1 text-center font-bold text-lg">
                These are your assigned projects
            </div>
            <LogoutButton />
        </div>
        <div className="pt-16">
            <div className="flex items-center justify-center">
                <div className="flex items-center space-x-6">
                    {projects.map((project: AssignedProject) => (
                        <ProjectCard key={`${project.id}-${project.title}`} {...project} />
                    ))}
                </div>
            </div>
        </div>
    </main>
  );
};

export default DesignerClient;

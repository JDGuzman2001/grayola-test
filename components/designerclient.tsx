"use client";

import React from 'react';
import { useUser } from "@/context/UserContext/userContext";
import ProjectCard from "@/components/designer-card ";
import DesignerSelect from "@/components/selectdesigner";
import { Button } from "@/components/ui/button";
import { createClient } from "@/supabase/client";
import LogoutButton from "@/components/logoutbutton";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AssignedProject {
  id: number;
  title: string;
  description: string;
  state: string;
  images: string[];
  email: string;
  // Add other properties specific to your project data
}

const DesignerClient: React.FC<{  projects: any[] }> = ({ projects }) => {
  const router = useRouter(); 
  




  return (
    <main className="bg-cyan-200">
        <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md flex justify-between items-center px-4 py-2"> {/* Ajusta el padding y la altura aquí */}
            <img src="/GrayolaIcon.svg" alt="GrayolaIcon" className="size-10" /> {/* Ajusta el tamaño del ícono aquí */}
            <LogoutButton />
        </div>
        <div className="pt-16"> {/* Usa padding-top para evitar el solapamiento */}
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

"use client";

import React from 'react';
import { useUser } from "@/context/UserContext/userContext";
import ProjectSelect from "@/components/project-manager/selectProject";
import DesignerSelect from "@/components/project-manager/selectDesigner";
import { Button } from "@/components/ui/button";
import { createClient } from "@/supabase/client";
import LogoutButton from "@/components/logoutButton";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const AssignClient: React.FC<{ designers: any[], projects: any[] }> = ({ designers, projects }) => {
  const { designerProjects, assignedProjects, setDesignerProjects, setAssignedProjects } = useUser();
  const router = useRouter(); 

  const handleAssign = async () => {
      if (!assignedProjects || !designerProjects) {
      return;
      }

      const supabase = createClient();

      const { id: projectId } = assignedProjects;
      const { id: designerId } = designerProjects;

      const { error } = await supabase
      .from('projects')
      .update({ state: 'Assigned', designer: designerId })
      .eq('id', projectId);

      if (error) {
        console.error('Error updating project:', error.message);
      } else {
        router.push('/project-manager');
      }
  };

  return (
    <main className="bg-cyan-200">
        <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md flex justify-between items-center px-4 py-2">
                <Link href={`/project-manager`}>
                    <div className="flex items-center">
                        <ChevronLeftIcon className="h-4 mr-2" />
                        Back
                    </div>
                </Link>
                <LogoutButton />
            </div>
            <div className="flex-grow flex items-center justify-center mt-10">
                <div className="flex items-center space-x-6">
                <ProjectSelect projects={projects} />
                <Button onClick={handleAssign} className="mx-4">Assign</Button>
                <DesignerSelect designers={designers} />
                </div>
            </div>
    </main>
  );
};

export default AssignClient;

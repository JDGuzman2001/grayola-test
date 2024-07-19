"use client";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext/userContext"

interface ProjectProps {
  id: number;
  title: string;
  description: string;
  images: string[];
  state: string;
  email: string;
}

const MAX_DESCRIPTION_LENGTH = 150; // Ajusta según tus necesidades

const truncateDescription = (description: string) => {
  if (description.length <= MAX_DESCRIPTION_LENGTH) {
    return description;
  }
  return description.slice(0, MAX_DESCRIPTION_LENGTH) + '...';
};

const ProjectSelect: React.FC<{ projects?: ProjectProps[] }> = ({ projects = [] }) => {
  const { assignedProjects,  setAssignedProjects } = useUser();
  
  const [selectedProject, setSelectedProject] = React.useState<ProjectProps | null>(null);

  const handleSelectChange = (value: string) => {
    const project = projects.find(p => p.id.toString() === value);
    setSelectedProject(project || null);
    setAssignedProjects(project || null); // Actualiza assignedProjects en el contexto
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 mt-10">
        <Select onValueChange={handleSelectChange} >
            <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an unassigned project" />
            </SelectTrigger>
            <SelectContent>
            <SelectGroup>
                {/* <SelectLabel>Projects</SelectLabel> */}
                {projects.map(project => (
                <SelectItem key={project.id} value={project.id.toString()}>{project.title}</SelectItem>
                ))}
            </SelectGroup>
            </SelectContent>
        </Select>
      </div>

      {!selectedProject && (
        <Card className="w-[300px] h-[600px] mb-10">
          <CardHeader>
            <CardTitle>No project selected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <span className="mb-2">Please select a project</span>
              <img src="/GrayolaIcon.svg" alt="GrayolaIcon" className="h-[150px] w-full" />
            </div>
          </CardContent>
        </Card>
      )}
      
      {selectedProject && (
        <Card key={selectedProject.id} className="w-[300px] h-[600px] mb-10">
          <CardHeader>
            <CardTitle>{selectedProject.id}</CardTitle>
            <CardTitle>{selectedProject.title}</CardTitle>
            <CardDescription>{truncateDescription(selectedProject.description)}</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedProject.images && selectedProject.images[0] ? (
              <div className="relative h-[150px] w-full bg-center">
                <Image
                  src={
                    selectedProject.images[0].startsWith('https') 
                      ? selectedProject.images[0] 
                      : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/storage/${selectedProject.images[0]}`
                  }
                  alt={selectedProject.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <span className="mb-2">No image</span>
                <img src="/GrayolaIcon.svg" alt="GrayolaIcon" className="h-[150px] w-full" />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="flex flex-col">
              <Button variant="outline" className="cursor-default hover:bg-white mb-4">Status: {selectedProject.state}</Button>
              <span className="text-sm">Created by: {selectedProject.email}</span>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ProjectSelect;

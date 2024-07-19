import React from "react";
import Image from "next/image";
import Link from 'next/link';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";


interface ProjectProps {
    id: number;
    title: string;
    description: string;
    state: string;
    images: string[];
    email: string;
  }

  const MAX_DESCRIPTION_LENGTH = 150; // Ajusta según tus necesidades

  const truncateDescription = (description: string) => {
      if (description.length <= MAX_DESCRIPTION_LENGTH) {
          return description;
      }
      return description.slice(0, MAX_DESCRIPTION_LENGTH) + '...';
  };

const ProjectCard: React.FC<ProjectProps> = ({
    id,
    title,
    description,
    state,
    images,
    email,
  }) => {
    return (
      <Link href={`/projects/${id}`}>
        <Card key={id} className="w-[300px] h-[600px] mb-10">
            <CardHeader>
                <CardTitle>{id}</CardTitle>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{truncateDescription(description)}</CardDescription>
            </CardHeader>
            <CardContent>
            {images && images[0] ? (
                <div className="relative h-[150px] w-full bg-center">
                    <Image
                        src={
                            images[0].startsWith('https') 
                            ? images[0] 
                            : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/storage/${images[0]}`
                        }
                        alt={title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t"
                    />
                </div>
            ) : <div className="flex flex-col items-center justify-center">
                    <span className="mb-2">No image</span>
                    <img src="/GrayolaIcon.svg" alt="GrayolaIcon" className="h-[150px] w-full" />
                </div>
                }
            </CardContent>
            <CardFooter className="flex justify-center">
                
                <div className="flex flex-col">
                <Button variant="outline" className="cursor-default hover:bg-white mb-4">Status: {state}</Button>
                <span className="text-sm">Created by: {email}</span>
                </div>
            </CardFooter>
        </Card>
      </Link>
    );
  };
  

export default ProjectCard;

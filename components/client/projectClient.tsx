"use client";

import React, { useState } from 'react';
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import LogoutButton from "@/components/logoutButton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext/userContext';
import { createClient } from "@/supabase/client";

type ProjectClientProps = {
    data: {
        id: string;
        title: string;
        description: string;
        images?: string[];
        state: string;
        email: string;
    };
};

  const ProjectClient: React.FC<ProjectClientProps> = ({ data }) => {
    
    const supabase = createClient();
    const router = useRouter();
    const { user } = useUser();
    const [loading, setLoading] = useState(true);  

    React.useEffect(() => {
        const checkUser = async () => {
            if (user) {
                const {data,  error} = await supabase.from('users').select().eq('email', user.email).single();
  
                if (data) {
                    if (data.role === 'Project Manager') {
                        setLoading(false);
                    } else if (data.role === 'Client') {
                        router.replace('/client');
                    } else if (data.role === 'Designer') {
                        router.replace('/designer');
                    }
                } 
            }
        };
  
        checkUser();
    }, [user, router]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen w-screen">
                <img src="/GrayolaIcon.svg" alt="GrayolaIcon" className="w-40 h-40" />
                <span>Loading...</span>
            </div>
        );
    }
    
  return (
    <main className="px-12 py-12 mx-auto min-h-screen bg-cyan-200">
        <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md flex justify-between items-center px-4 py-2">
            <Link href="/project-manager">
                <div className="flex items-center">
                    <ChevronLeftIcon className="h-4 mr-2" />
                    Back
                </div>
            </Link>
            <div className="mx-auto">
                <Link href={`/modify/${data.id}`}>
                    <Button>
                        Modify
                    </Button>
                </Link>
            </div>
            <LogoutButton />
        </div>
        <Card key={data.id} className="w-full mb-4 mt-10">
            <CardHeader>
                <CardTitle>{data.id}</CardTitle>
                <CardTitle>{data.title}</CardTitle>
                <CardDescription>{data.description}</CardDescription>
            </CardHeader>
            <CardContent>
            {data.images && data.images[0] ? (
                <div className="space-y-4">
                    {data.images.map((image: string, index: number) => (
                        <div key={index} className="relative h-[600px] w-full bg-center">
                            <Image
                                src={
                                    image.startsWith('https') 
                                    ? image 
                                    : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/storage/${image}`
                                }
                                alt={data.title}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-t"
                            />
                        </div>
                    ))}
                </div>
            ) : <div className="flex flex-col items-center justify-center h-96">
                    <span className="mb-2">No image</span>
                    <img src="/GrayolaIcon.svg" alt="GrayolaIcon" className="h-full w-full" />
                </div>
                }
            </CardContent>
            <CardFooter className="flex justify-center">
            <div className="flex flex-col">
                <Button variant="outline" className="cursor-default hover:bg-white mb-4">Status: {data.state}</Button>
                <span className="text-sm">Created by: {data.email}</span>
                </div>
            </CardFooter>
        </Card>
    </main>
    );
};

export default ProjectClient;
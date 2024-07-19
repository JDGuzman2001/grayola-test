"use client";

import React, { useState } from 'react';
import { Pencil1Icon, ChevronLeftIcon, TrashIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import UpdateInfo from "@/components/updateinfo";
import Link from 'next/link';
import LogoutButton from "@/components/logoutbutton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import { deleteProject } from '@/actions/index';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from '@/context/UserContext/userContext';
import { createClient } from "@/supabase/client";

type ModifyClientProps = {
    data: {
        id: string;
        title: string;
        description: string;
        images?: string[];
        state: string;
        email: string;
    };
};

const ModifyClient: React.FC<ModifyClientProps> = ({ data }) => {
    const [isFormVisible, setFormVisible] = useState(false);
    const [deleteStatus, setDeleteStatus] = useState<string | null>(null); // Para manejar el estado de la eliminación
    const router = useRouter();
    const handleEditClick = () => {
        setFormVisible(!isFormVisible);
    };
    const { user, setUser, allProjects, getAllProjects } = useUser();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);  // Start with loading true

    React.useEffect(() => {
        const checkUser = async () => {
            if (user) {
                console.log('User:', user);
                console.log('User Email:', user.email);
                const {data,  error} = await supabase.from('users').select().eq('email', user.email).single();
  
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
            }
        };
  
        checkUser();
    }, [user, router]);

    const handleDeleteClick = async () => {
        const result = await deleteProject(data.id);


        if (result.type === "success") {
            setDeleteStatus('Project deleted successfully');
            // Redirigir o realizar otras acciones necesarias
            // Por ejemplo: redirigir a la página de proyectos
            router.replace('/project-manager');
        } else {
            setDeleteStatus(result.message);
        }
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
        <div className="px-12 py-12 max-w-7xl mx-auto min-h-screen bg-cyan-200">
            <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md flex justify-between items-center px-4 py-2">
                <Link href={`/projects/${data.id}`}>
                    <div className="flex items-center">
                        <ChevronLeftIcon className="h-4 mr-2" />
                        Back
                    </div>
                </Link>
                <LogoutButton />
            </div>
            <h1 className="mt-10 text-center text-4xl font-bold">Modify</h1>
            {isFormVisible && (
                <div className="mt-10">
                    <UpdateInfo 
                        uid={data.id}
                        initialTitle={data.title}
                        initialDescription={data.description}
                        initialImages={data.images || []}
                    />
                </div>
            )}
            <Card key={data.id} className="w-full mb-4 mt-10">
                <CardHeader>
                    <div className="flex place-items-center justify-between">
                        <CardTitle>{data.id}</CardTitle>
                        <div className="flex">
                            <Pencil1Icon onClick={handleEditClick} className="h-6 w-6 ml-2 cursor-pointer" />
                            {/* <TrashIcon className="h-6 w-6 ml-2 cursor-pointer text-red-400" /> */}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <TrashIcon className="h-6 w-6 ml-2 cursor-pointer text-red-400" />
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                    <DialogTitle>Are you sure you want to delete the project?</DialogTitle>
                                    <DialogDescription>
                                        This decision is irreversible.
                                    </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                    <Button onClick={handleDeleteClick}>Yes</Button>
                                    <Button>No</Button>
                                    </DialogFooter>
                                </DialogContent>
                                </Dialog>
                        </div>
                        
                    </div>
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
        </div>
    );
};

export default ModifyClient;

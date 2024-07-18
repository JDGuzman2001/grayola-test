"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";
import { useUser } from '@/context/UserContext/userContext';
import { registerUserInformation, sendProject } from '@/actions';
import { useFormState } from 'react-dom';
import SubmitButton from '@/components/submit-button-project';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
  } from "@/components/ui/menubar"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { set } from 'zod';
import { get } from 'http';

interface Project {
    id: number;
    title: string;
    description: string;
    state: string;
    // Add other properties specific to your project data
  }

  const initialState = {
    message: '',
    errors: null,
  };
  

export default function UserType() {
    const { user, setUser, projects, getProjects } = useUser();
    const supabase = createClient();
    const router = useRouter();
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showProjects, setShowProjects] = useState(false);
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [email, setEmail] = useState("");
    const [state, formAction] = useFormState<any>(
        sendProject as any,
        initialState
    );

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        router.push('/login');
    };

    const button_class = "bg-green-400 text-black hover:bg-fuchsia-400 border border-black";

    const handleCreateProject = () => {
        setShowCreateForm(true);
        setShowProjects(false);
        const email = user.email;
        setEmail(email);
    };

    const handleViewProjects = async () => {
        setShowProjects(true);
        setShowCreateForm(false);
        setLoading(true);
        await getProjects();
        setLoading(false);
    };



    return (
        <div>
            <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md flex justify-between items-center px-4 py-2">
                <Menubar>
                    <MenubarMenu>
                        <MenubarTrigger onClick={handleCreateProject}>Create Project</MenubarTrigger>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger onClick={handleViewProjects}>View My Projects</MenubarTrigger>
                    </MenubarMenu>
                    
                </Menubar>
                <Button onClick={handleLogout} className="ml-auto" variant="destructive">
                    Logout
                </Button>
            </div>
            <main className="flex flex-col items-center justify-center min-h-screen bg-cyan-200 pt-16">
                <img src="/GrayolaIcon.svg" alt="GrayolaIcon" className="w-40 h-40" />
                {showCreateForm && (
                    <div className="mx-auto w-full h-full p-12 rounded-lg border-2 border-gray-500 border-opacity-10 shadow-lg bg-slate-100">
                        <form action={formAction} >
                            <div className="grid w-full items-center gap-1.5 mb-4">
                                <Label htmlFor="title">Title</Label>
                                <Input 
                                    type="string" 
                                    id="title" 
                                    name="title"
                                    placeholder="Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    />
                                {state?.errors?.title && (
                                <span id="name-error" className="text-red-600 text-sm">
                                    {state.errors.title.join(',')}
                                </span>
                                )}
                            </div>
                            <div className="grid w-full items-center gap-1.5 mb-4">
                                <Label htmlFor="description">Description</Label>
                                <Input 
                                    type="text" 
                                    id="description" 
                                    name="description"
                                    placeholder="Description"
                                    value={description}
                                    className="h-24"
                                    onChange={(e) => setDescription(e.target.value)}
                                    />
                                {state?.errors?.description && (
                                <span id="name-error" className="text-red-600 text-sm">
                                    {state.errors.description.join(',')}
                                </span>
                                )}
                            </div>   
                            <div className="mb-6">
                                <label htmlFor="images" className="block mb-2">
                                    Image(s)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="images"
                                    name="images"
                                    multiple
                                />
                                {state?.errors?.imageUrl && (
                                    <span id="name-error" className="text-red-600 text-sm">
                                    {state.errors.imageUrl.join(',')}
                                    </span>
                                )}
                            </div>

                            <input type="hidden" name="email" value={email} />
                            
                            
                            <SubmitButton/>
                        </form>
                    </div>
                )}
                {showProjects && (
                    <div className="mx-auto w-full h-full p-12 rounded-lg border-2 border-gray-500 border-opacity-10 shadow-lg bg-slate-100">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <span>Loading...</span>
                            </div>
                        ) : (
                            projects && projects.map((project: Project) => (
                                <Card key={project.id} className="w-[350px] mb-4">
                                    <CardHeader>
                                        <CardTitle>{project.title}</CardTitle>
                                        <CardDescription>{project.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {/* Aquí puedes agregar más detalles si es necesario */}
                                    </CardContent>
                                    <CardFooter className="flex justify-center">
                                        <Button variant="outline">State: {project.state}</Button>
                                    </CardFooter>
                                </Card>
                            ))
                        )}
                    </div>
                )}
                
            </main>
        </div>
    );
}


  

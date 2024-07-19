"use client";
import * as React from "react"
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext/userContext';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import { registerUserInformation } from '@/actions';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import SubmitButton from '@/components/submit-button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { createClient } from '@/supabase/client';
  


const initialState = {
    message: '',
    errors: null,
  };

const RegisterPage: React.FC = () => {
    const { email, setEmail, password, setPassword, user} = useUser();
    const router = useRouter();
    const supabase = createClient();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [borndate, setBorndate] = useState('');
    const [role, setRole] = useState("Client");
    const [state, formAction] = useFormState<any>(
        registerUserInformation as any,
        initialState
    );

    React.useEffect(() => {
        const checkUser = async () => {
            if (user) {
                console.log('User:', user);
                console.log('User Email:', user.email);
                const {data,  error} = await supabase.from('users').select().eq('email', user.email).single();

                // if (error) {
                //     console.error('Error fetching user in Sign Up Page:', error.message);
                //     router.replace('/login');
                // }

                if (data) {
                    if (data.role === 'Client') {
                        router.replace('/client');
                      } else if (data.role === 'Project Manager') {
                        router.replace('/project-manager');
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

    

    

    return (
        <div className="px-12 pt-24 pb-12 min-h-screen max-w-[100rem] mx-auto flex gap-56 bg-cyan-200">
        <div>
            <img src="/GrayolaIcon.svg" alt="GrayolaIcon"  />
        </div>
        <div className="mx-auto w-full h-full p-12 rounded-lg border-2 border-gray-500 border-opacity-10 shadow-lg bg-slate-100">
            {state?.type === 'error' && (
            <p className="text-lg mb-2 bg-green-951 border-2 border-gray-300 rounded-md p-2 my-4">
                {state.message}
            </p>
            )}
            <form action={formAction} >
                <div className="grid w-full items-center gap-1.5 mb-4">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                        type="email" 
                        id="email" 
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                         />
                    {state?.errors?.email && (
                    <span id="name-error" className="text-red-600 text-sm">
                        {state.errors.email.join(',')}
                    </span>
                    )}
                </div>
                {/* <div className="grid w-full  items-center gap-1.5 mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                        type="password" 
                        id="password" 
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                         />
                    {state?.errors?.password && (
                    <span id="name-error" className="text-red-600 text-sm">
                        {state.errors.password.join(',')}
                    </span>
                    )}
                </div> */}
                <div className="grid w-full items-center gap-1.5 mb-4">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                        type="text" 
                        id="name" 
                        name="name"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                         />
                    {state?.errors?.name && (
                    <span id="name-error" className="text-red-600 text-sm">
                        {state.errors.name.join(',')}
                    </span>
                    )}
                </div>   
                
                <div className="grid w-full items-center gap-1.5 mb-4">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                        type="number" 
                        id="phone"
                        name="phone" 
                        placeholder="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                         />
                    {state?.errors?.phone && (
                    <span id="name-error" className="text-red-600 text-sm">
                        {state.errors.phone.join(',')}
                    </span>
                    )}
                </div>

                <div className="grid w-full items-center gap-1.5 mb-4">
                    <Label htmlFor="borndate">Born Date</Label>
                    <Input 
                        type="date" 
                        id="borndate" 
                        name="borndate"
                        value={borndate}
                        onChange={(e) => setBorndate(e.target.value)}
                         />
                    {state?.errors?.borndate && (
                    <span id="name-error" className="text-red-600 text-sm">
                        {state.errors.borndate.join(',')}
                    </span>
                    )}
                </div>
                <div className="mb-2">
                    <Label htmlFor="role">What is your role? (Press the button to see more options)</Label>
                </div>
                <div className="mb-10" >
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">{role}</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Options</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={role} onValueChange={setRole}>
                        <DropdownMenuRadioItem value="Client">Client</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Project Manager">Project Manager</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Designer">Designer</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <input type="hidden" name="role" value={role} />
                
                <SubmitButton/>
            </form>
        </div>
        </div>
    );
};

export default RegisterPage;

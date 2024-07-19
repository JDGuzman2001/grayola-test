"use client";
import * as React from "react";
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext/userContext';
import { useState, useEffect } from 'react';
import { useFormState } from 'react-dom';
import { registerUserInformation } from '@/actions';
import { Label } from "@/components/ui/label";
import SubmitButton from '@/components/submitButton';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from '@/supabase/client';

const initialState = {
    message: '',
    errors: null,
};

const RegisterPage: React.FC = () => {
    const { user } = useUser();
    const router = useRouter();
    const supabase = createClient();
    const [name, setName] = useState("");
    const [role, setRole] = useState("Client");
    const [useremail, setUseremail] = useState(""); 
    const [state, formAction] = useFormState<any>(
        registerUserInformation as any,
        initialState
    );

    useEffect(() => {
        if (user) {
            setName(user.user_metadata.name);
            setUseremail(user.email);

            const checkUser = async () => {
                const { data, error } = await supabase.from('users').select().eq('email', user.email).single();

                if (data) {
                    if (data.role === 'Client') {
                        router.replace('/client');
                    } else if (data.role === 'Project Manager') {
                        router.replace('/project-manager');
                    } else if (data.role === 'Designer') {
                        router.replace('/designer');
                    }
                }
            };

            checkUser();
        }
    }, [user, router, supabase]);

    return (
        <div className="px-12 pt-24 pb-12 min-h-screen max-w-[100rem] mx-auto flex gap-56 bg-cyan-200">
            <div>
                <img src="/GrayolaIcon.svg" alt="GrayolaIcon" />
            </div>
            <div className="mx-auto w-full h-full p-12 rounded-lg border-2 border-gray-500 border-opacity-10 shadow-lg bg-slate-100">
                {state?.type === 'error' && (
                    <p className="text-lg mb-2 bg-green-951 border-2 border-gray-300 rounded-md p-2 my-4">
                        {state.message}
                    </p>
                )}
                <form action={formAction}>
                    <input type="hidden" name="email" value={useremail} />
                    <input type="hidden" name="name" value={name} />
                    <div className="mb-10 flex justify-center">
                        <Label htmlFor="role">What is your role? (Press the button to see more options)</Label>
                    </div>
                    <div className="mb-10 flex justify-center">
                        <Select onValueChange={setRole} value="Client">
                            <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a role"/>
                            </SelectTrigger>
                            <SelectContent>
                            <SelectGroup>
                                <SelectItem value="Client">Client</SelectItem>
                                <SelectItem value="Project Manager">Project Manager</SelectItem>
                                <SelectItem value="Designer">Designer</SelectItem>
                            </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <input type="hidden" name="role" value={role} />
                    <div className="flex justify-center">
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;

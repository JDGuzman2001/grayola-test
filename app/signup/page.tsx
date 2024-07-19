"use client";
import * as React from "react"
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext/userContext';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import { registerUserInformation } from '@/actions';
import { Label } from "@/components/ui/label"
import SubmitButton from '@/components/submitButton';
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
    const { user } = useUser();
    const router = useRouter();
    const supabase = createClient();
    const [name, setName] = useState('');
    const [role, setRole] = useState("Client");
    const [state, formAction] = useFormState<any>(
        registerUserInformation as any,
        initialState
    );

    React.useEffect(() => {
        const checkUser = async () => {
            if (user) {
                const {data,  error} = await supabase.from('users').select().eq('email', user.email).single();

                if (data) {
                    if (data.role === 'Client') {
                        router.replace('/client');
                      } else if (data.role === 'Project Manager') {
                        router.replace('/project-manager');
                      } else if (data.role === 'Designer') {
                        router.replace('/designer');
                      }
                } else {
                    
                }
            }
        };

        checkUser();
    }, [user, router]);
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
              <input type="hidden" name="email" value={user.email} />
              <input type="hidden" name="name" value={user.user_metadata.name} />
              <div className="mb-10 flex justify-center">
                <Label htmlFor="role">What is your role? (Press the button to see more options)</Label>
              </div>
              <div className="mb-10 flex justify-center">
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
              <div className="flex justify-center">
                <SubmitButton />
              </div>
            </form>
          </div>
        </div>
      );
};

export default RegisterPage;

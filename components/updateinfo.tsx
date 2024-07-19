"use client";

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useFormState } from 'react-dom';
import {  updateProject } from '@/actions';
import { useState } from 'react';
import SubmitButton from "@/components/submit-button-update"

const initialState = {
    message: '',
    errors: null,
};

type UpdateInfoProps = {
    uid: string;
    initialTitle: string;
    initialDescription: string;
    initialImages: string[];
};

const UpdateInfo: React.FC<UpdateInfoProps> = ({uid, initialTitle, initialDescription, initialImages }) => {
    const [state, formAction] = useFormState<any>(
        updateProject as any,
        initialState
    );

    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);
    const [images, setImages] = useState(initialImages);
    const [id, setId] = useState(uid);


    return (
        <div className="mx-auto w-[70%] h-full p-12 rounded-lg border-2 border-gray-500 border-opacity-10 shadow-lg bg-slate-100">
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
                    <Textarea
                        id="description"
                        name="description"
                        placeholder="Description"
                        value={description}
                        className="h-24 w-full border rounded-lg p-2"
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

            <input type="hidden" name="id" value={id} />
            
            
            <SubmitButton/>
        </form>
        </div>
        
    );
}

export default UpdateInfo;
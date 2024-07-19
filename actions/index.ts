'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/supabase/client';

/**
 * Registers user information by validating form data and inserting it into the "users" table in Supabase.
 * Redirects to the loading page upon success or returns an error message upon failure.
 */
export async function registerUserInformation(prevState: any, formData: FormData){
    const formEntries = Object.fromEntries(formData.entries());
    const schema = z.object({
        email: z.string().min(1).email("This is not a valid Email address"),
        name: z.string().min(4),
        role: z.string().min(1),
    });

    const validateFields = schema.safeParse({
        email: formData.get('email'),
        name: formData.get('name'),
        role: formData.get('role'),

    });
    if (!validateFields.success){
        return{
            type: "error",
            errors: validateFields.error.flatten().fieldErrors,
            message: 'Missing required fields, failed to upload item',
        }
    } 

    const {
        email,
        name,
        role,
    } = validateFields.data;

    try {
        const supabase = createClient();
        const { error: productsError } = await supabase.from("users").insert({
            email, 
            name, 
            role})

            if (productsError){
                return {
                    type: "error",
                    message: 'Database Error: Failed to create item',
                }
            }
    } catch (error) {
        return {
            type: "error",
            message: 'Failed to create item',
        }
    }
    redirect('/loading');
}

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

/**
 * Sends a project by validating form data and inserting it into the "projects" table in Supabase.
 * Uploads any provided images to Supabase storage and associates their paths with the project.
 * Redirects to the loading page upon success or returns an error message upon failure.
 */
export async function sendProject(prevState: any, formData: FormData){
    const formEntries = Object.fromEntries(formData.entries());
    console.log(formEntries);

    const schema = z.object({
        title: z.string().min(1),
        description: z.string().min(4),
        images: z.array(z.any()).optional(),
        email: z.string().min(1).email("This is not a valid Email address"),
    });

    const validateFields = schema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        images: formData.getAll('images').length ? formData.getAll('images') : [''],
        email: formData.get('email'),
    });
    if (!validateFields.success){
        return{
            type: "error",
            errors: validateFields.error.flatten().fieldErrors,
            message: 'Missing required fields, failed to upload item',
        }
    } 

    const {
        title,
        description,
        images,
        email

    } = validateFields.data;

    try {
        const supabase = createClient();
        let imagePaths: string[] = [];
        if (images && images.length > 0 && images[0].name !== 'undefined') {
            imagePaths = await Promise.all(images.map(async (image) => {
                const fileName = `${Math.random()}-${image.name}`;
                const { data, error } = await supabase.storage.from("storage").upload(fileName, image, {
                    contentType: image.type,
                });

                if (error) {
                    throw new Error('Database Error: Failed to upload image');
                }
                return data.path;
            }));
        } 
        const { error: productsError } = await supabase.from("projects").insert({
            title, 
            description, 
            images: imagePaths,
            state: 'Pending',
            email: email
            })

            if (productsError){
                return {
                    type: "error",
                    message: 'Database Error: Failed to create item',
                }
            } 
    } catch (error) {
        return {
            type: "error",
            message: 'Failed to create item',
        }
    }
    redirect('/loading');
}


/**
 * Updates an existing project by validating form data and updating the "projects" table in Supabase.
 * Uploads any new images to Supabase storage and associates their paths with the project.
 * Revalidates and redirects to the modified project page upon success or returns an error message upon failure.
 */
export async function updateProject(prevState: any, formData: FormData){
    const formEntries = Object.fromEntries(formData.entries());

    const schema = z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        description: z.string().min(4),
        images: z.array(z.any()).optional(),
    });

    const validateFields = schema.safeParse({
        id: formData.get('id'),
        title: formData.get('title'),
        description: formData.get('description'),
        images: formData.getAll('images').length ? formData.getAll('images') : [''],
    });
    if (!validateFields.success){
        return{
            type: "error",
            errors: validateFields.error.flatten().fieldErrors,
            message: 'Missing required fields, failed to upload item',
        }
    } 

    const {
        id,
        title,
        description,
        images,
    } = validateFields.data;

    try {
        const supabase = createClient();
        let imagePaths: string[] = [];
        if (images && images.length > 0 && images[0].name !== 'undefined') {
            imagePaths = await Promise.all(images.map(async (image) => {
                const fileName = `${Math.random()}-${image.name}`;
                const { data, error } = await supabase.storage.from("storage").upload(fileName, image, {
                    contentType: image.type,
                });

                if (error) {
                    throw new Error('Database Error: Failed to upload image');
                }
                return data.path;
            }));
        } 
        
        const { error: projectsError } = await supabase
            .from("projects")
            .update({
                title,
                description,
                images: imagePaths.length ? imagePaths : undefined,
            })
            .eq('id', id);

            if (projectsError){
                return {
                    type: "error",
                    message: 'Database Error: Failed to create item',
                }
            } else {
                revalidatePath('/modify/'+id);
                redirect('/modify/'+id);
            }
    } catch (error) {
        return {
            type: "error",
            message: 'Failed to create item',
        }
    }
}

export async function deleteProject(projectId: string) {
    if (!projectId) {
        return {
            type: "error",
            message: 'Invalid project ID provided',
        };
    }

    try {
        const supabase = createClient();

        const { error } = await supabase
            .from("projects")
            .delete()
            .eq('id', projectId);

        if (error) {
            return {
                type: "error",
                message: 'Database Error: Failed to delete project',
            };
        }
        return {
            type: "success",
            message: 'Project deleted successfully',
        };

    } catch (error) {
        return {
            type: "error",
            message: 'Failed to delete project',
        };
    }
    
}
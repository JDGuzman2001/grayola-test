'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/supabase/client';
import { useUser } from '@/context/UserContext/userContext';


export async function registerUserInformation(prevState: any, formData: FormData){
    const formEntries = Object.fromEntries(formData.entries());
    console.log('Form Data:', formEntries);

    const schema = z.object({
        email: z.string().min(1).email("This is not a valid Email address"),
        // password: z.string().min(5),
        name: z.string().min(4),
        phone: z.string().min(1),
        borndate: z.string().min(1),
        role: z.string().min(1),
    });

    const validateFields = schema.safeParse({
        email: formData.get('email'),
        // password: formData.get('password'),
        name: formData.get('name'),
        phone: formData.get('phone'),
        borndate: formData.get('borndate'),
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
        //password,
        name,
        phone,
        borndate,
        role,
    } = validateFields.data;

    try {
        const supabase = createClient();
        const { error: productsError } = await supabase.from("users").insert({
            email, 
            //password, 
            name, 
            phone, 
            borndate, 
            role})

            if (productsError){
                console.log('Database Error:', productsError);
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

    // revalidatePath('/');
    redirect('/loading');
}

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export async function sendProject(prevState: any, formData: FormData){
    const formEntries = Object.fromEntries(formData.entries());


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
        // if (images?.length) {
        if (images && images.length > 0 && images[0].name !== 'undefined') {
            imagePaths = await Promise.all(images.map(async (image) => {
                const fileName = `${Math.random()}-${image.name}`;
                const { data, error } = await supabase.storage.from("storage").upload(fileName, image, {
                    contentType: image.type,
                });

                if (error) {
                    console.error(error);
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
                console.log('Database Error:', productsError);
                return {
                    type: "error",
                    message: 'Database Error: Failed to create item',
                }
            } else {
                console.log('Project Created');
            }
       


    } catch (error) {
        return {
            type: "error",
            message: 'Failed to create item',
        }
    }

    // revalidatePath('/client');
    redirect('/loading');
}



export async function updateProject(prevState: any, formData: FormData){
    const formEntries = Object.fromEntries(formData.entries());
    console.log('Form Data:', formEntries);


    const schema = z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        description: z.string().min(4),
        images: z.array(z.any()).optional(),
        // email: z.string().min(1).email("This is not a valid Email address"),
    });

    const validateFields = schema.safeParse({
        id: formData.get('id'),
        title: formData.get('title'),
        description: formData.get('description'),
        images: formData.getAll('images').length ? formData.getAll('images') : [''],
        // email: formData.get('email'),


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
        // email

    } = validateFields.data;

    try {
        const supabase = createClient();
        let imagePaths: string[] = [];
        // if (images?.length) {
        if (images && images.length > 0 && images[0].name !== 'undefined') {
            imagePaths = await Promise.all(images.map(async (image) => {
                const fileName = `${Math.random()}-${image.name}`;
                const { data, error } = await supabase.storage.from("storage").upload(fileName, image, {
                    contentType: image.type,
                });

                if (error) {
                    console.error(error);
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
                images: imagePaths.length ? imagePaths : undefined, // Update images only if there are new images
                // email,
            })
            .eq('id', id);

            if (projectsError){
                console.log('Database Error:', projectsError);
                return {
                    type: "error",
                    message: 'Database Error: Failed to create item',
                }
            } else {
                console.log('Project Created');
            }
       


    } catch (error) {
        return {
            type: "error",
            message: 'Failed to create item',
        }
    }

    revalidatePath('/modify/'+id);
    redirect('/modify/'+id);
}

export async function deleteProject(projectId: string) {
    console.log('Project ID:', projectId);
    // Validar que el ID no esté vacío
    if (!projectId) {
        return {
            type: "error",
            message: 'Invalid project ID provided',
        };
    }

    try {
        const supabase = createClient();

        // Eliminar el proyecto de la base de datos
        const { error } = await supabase
            .from("projects")
            .delete()
            .eq('id', projectId);

        if (error) {
            console.error('Database Error:', error);
            return {
                type: "error",
                message: 'Database Error: Failed to delete project',
            };
        }

        console.log('Project Deleted');
        return {
            type: "success",
            message: 'Project deleted successfully',
        };

    } catch (error) {
        console.error('Unexpected Error:', error);
        return {
            type: "error",
            message: 'Failed to delete project',
        };
    }
    
}
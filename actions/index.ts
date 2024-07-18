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
    // const { user } = useUser();
    const formEntries = Object.fromEntries(formData.entries());
    // console.log('Form Data:', formEntries);
    // console.log('Description:', formData.get('description'));
    // console.log('Title:', formData.get('title'));
    // console.log('Email:', formData.get('email'));
    console.log('Images:', formData.getAll('images'));

    const schema = z.object({
        title: z.string().min(1),
        description: z.string().min(4),
        // images: z.any().array().nonempty().refine(files => files.every(file => file.size <= MAX_FILE_SIZE), `Max image size is 5MB`).refine(files => files.every(file => ACCEPTED_IMAGE_TYPES.includes(file.type)), `Only .jpg, .jpeg, .png, .gif, .webp files are accepted`),
        // images: z.any().
        //         array().
        //         optional().
        //         refine(files => (files || []).every(file => file.size <= MAX_FILE_SIZE), `Max image size is 5MB`).refine(files => (files || []).every(file => ACCEPTED_IMAGE_TYPES.includes(file.type)), `Only .jpg, .jpeg, .png, .gif, .webp files are accepted`),
        
        
        images: z.array(z.any()).optional(),
        // Funciona pero sube imagenes undefined
        // images: z.any().array().optional().refine(files => {
        //     if (!files || files.length === 0) return true; // No images selected is valid
        //     return files.every(file => (
        //         file.size === 0 || (file.size <= MAX_FILE_SIZE && ACCEPTED_IMAGE_TYPES.includes(file.type))
        //     ));
        // }, 'Invalid images selection'),
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
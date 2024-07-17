// 'use server';

// import { revalidatePath } from 'next/cache';
// import { createClient } from '@supabase/supabase-js'
// import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';

// import { error } from 'console';
// import { z } from 'zod';


// const MAX_FILE_SIZE = 5000000;
// const ACCEPTED_IMAGE_TYPES = [
//   'image/jpeg',
//   'image/jpg',
//   'image/png',
//   'image/webp',
// ];

// export async function sellYourItemAction(prevState: any, formData: FormData){


//     const schema = z.object({
//         name: z.string().min(4),
//         description: z.string().min(5),
//         contactEmail: z.string().min(1).email("This is not a valid Email address"),
//         price: z.string().min(1),
//         imageUrl: z.any().refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB`).refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), `Only .jpg, .jpeg, .png, .gif, .webp files are accepted`),
//     });

//     const validateFields = schema.safeParse({
//         name: formData.get('name'),
//         description: formData.get('description'),
//         contactEmail: formData.get('contactEmail'),
//         price: formData.get('price'),
//         imageUrl: formData.get('imageUrl'),
//     });
//     if (!validateFields.success){
//         return{
//             type: "error",
//             errors: validateFields.error.flatten().fieldErrors,
//             message: 'Missing required fields, failed to upload item',
//         }
//     } 

//     const {name, imageUrl, description, price, contactEmail} = validateFields.data;

//     try {
//         const fileName = `${Math.random()}-${imageUrl.name}`
//         const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
//         const { data, error } = await supabase.storage.from("storage").upload(fileName, imageUrl, {
//             contentType: "image/jpeg",
//         });

//         if (error){
//             console.error(error);
//             return {
//                 type: "error",
//                 message: 'Database Error: Failed to upload image',
//             }
//         }

//         if (data) {
//             const path = data.path;
//             const { error: productsError } = await supabase.from("easysell-products").insert({name, imageUrl: path, description, price, contactEmail})

//             if (productsError){
//                 // console.error(productsError);
//                 return {
//                     type: "error",
//                     message: 'Database Error: Failed to create item',
//                 }
//             }
//         }

       


//     } catch (error) {
//         return {
//             type: "error",
//             message: 'Failed to create item',
//         }
//     }

//     revalidatePath('/');
//     redirect('/');
// }
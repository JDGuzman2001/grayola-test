import { createClient } from "@/supabase/client";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ChevronLeftIcon } from "@radix-ui/react-icons"
import Link from 'next/link';


type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};


export async function generateStaticParams() {
    const supabase = createClient();
    const { data: products, error } = await supabase.from('projects').select();

    if (error) {
    // console.error('Error fetching products:', error);
    return [];
    }

    // console.log('Products:', products);

    if (!products) {
    return [];
    }

    // Mapea los IDs directamente
    const productIds = products.map(item => item.id);
    // console.log('Product IDs:', productIds);

    return products.map(({ id }) => ({
    slug: id.toString(),
    }));
}

export default async function Project({ params }: Props) {
  const supabase = createClient();
  const { data } = await supabase
    .from('projects')
    .select()
    .match({ id: params.slug })
    .single();



  return (
    <div className="px-12 py-12 max-w-7xl mx-auto min-h-screen bg-cyan-200">
        <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md flex justify-between items-center px-4 py-2 gap-64">
                <Link href="/project-manager">
                    <div className="flex items-center">
                        <ChevronLeftIcon className="h-4 mr-2" />
                        Back
                    </div>
                </Link>
                <Link href={`/modify/${data.id}`}>
                    <Button>
                        Modify
                    </Button>
                </Link>
                <Button>
                    Assign
                </Button>
                <Button  className="ml-auto" variant="destructive">
                    Logout
                </Button>
        </div>
        <Card key={data.id} className="w-full mb-4 mt-10">
            <CardHeader>
                <CardTitle>{data.id}</CardTitle>
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
}
import { createClient } from "@/supabase/client";
import ProjectClient  from "@/components/projectclient";

type Props = {
  params: { slug: string };
//   searchParams: { [key: string]: string | string[] | undefined };
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

    if (!data) {
        return <div>Project not found</div>;
    }

    return <ProjectClient data={data} />;
}
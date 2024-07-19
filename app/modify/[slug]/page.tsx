import { createClient } from "@/supabase/client";
import ModifyClient from "@/components/modifyclient";

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
    const supabase = createClient();
    const { data: products, error } = await supabase.from('projects').select();

    if (error) {
        return [];
    }

    if (!products) {
        return [];
    }

    return products.map(({ id }) => ({
        slug: id.toString(),
    }));
}

export default async function Modify({ params }: Props) {
    const supabase = createClient();
    const { data } = await supabase
        .from('projects')
        .select()
        .match({ id: params.slug })
        .single();

    if (!data) {
        return <div>Project not found</div>;
    }

    return <ModifyClient data={data} />;
}

import { createClient } from "@/supabase/client";
import ProjectClient  from "@/components/client/projectClient";

type Props = {
  params: { id: string };
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

    const productIds = products.map(item => item.id);

    return products.map(({ id }) => ({
      id: id.toString(),
    }));
}

export default async function Project({ params }: Props) {
  const supabase = createClient();
  const { data } = await supabase
    .from('projects')
    .select()
    .match({ id: params.id })
    .single();

    if (!data) {
        return <div>Project not found</div>;
    }

    return <ProjectClient data={data} />;
}
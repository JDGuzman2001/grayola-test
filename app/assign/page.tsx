import { createClient } from "@/supabase/client";
import AssignClient from "@/components/project-manager/assignClient";

export const revalidate = 10;

export default async function Assign() {
  const supabase = createClient();

  const { data: designers, error: designersError } = await supabase.from('users').select().eq('role', 'Designer');
  const { data: projects, error: projectsError } = await supabase.from('projects').select().eq('state', 'Pending');

  if (designersError || projectsError) {
    return <p>Error loading data</p>;
  }

  return (
    <AssignClient designers={designers || []} projects={projects || []} />
  );
}


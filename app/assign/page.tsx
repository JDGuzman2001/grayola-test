import { createClient } from "@/supabase/client";
import AssignClient from "@/components/assignclient";

export const revalidate = 1;

export default async function Assign() {
  const supabase = createClient();

  const { data: designers, error: designersError } = await supabase.from('users').select().eq('role', 'Designer');
  const { data: projects, error: projectsError } = await supabase.from('projects').select().eq('state', 'Pending');

  if (designersError || projectsError) {
    // console.error('Error fetching data:', designersError || projectsError);
    return <p>Error loading data</p>;
  }

//   console.log('Designers:', designers);
//   console.log('Projects:', projects);

  return (
    <AssignClient designers={designers || []} projects={projects || []} />
  );
}


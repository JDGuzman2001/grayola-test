"use client"; 

import { useRouter } from 'next/navigation';
import { createClient } from "@/supabase/client";
import { Button } from "@/components/ui/button";
import { useUser } from '@/context/UserContext/userContext';

const LogoutButton = () => {
    const supabase = createClient();
    const router = useRouter();
    const { user, setUser, projects, getProjects } = useUser();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        router.push('/login');
    };

    return (
        <Button  
            className="ml-auto" 
            variant="destructive"
            onClick={handleLogout}
        >
            Logout
        </Button>
    );
};

export default LogoutButton;
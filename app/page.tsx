import { Button } from "@/components/ui/button"
import Link from "next/link"


export default function Home() {
  return (    
    <main className="flex flex-col items-center justify-center min-h-screen bg-cyan-200">
      <div>
        <img src="/GrayolaIcon.svg" alt="GrayolaIcon" className="w-40 h-40" />
      </div>
      <div>
        <Link href="/login">
          <Button variant="secondary">Continue</Button>
        </Link>
        
      </div>
    </main>
  );
}


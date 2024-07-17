import { Button } from "@/components/ui/button"
import Link from "next/link"
 

export default function UserType() {
  const button_class = "bg-green-400 text-black hover:bg-fuchsia-400 border border-black"
  return (    
    <main className="flex flex-col items-center justify-center min-h-screen bg-cyan-200">
      <img src="/GrayolaIcon.svg" alt="GrayolaIcon" className="w-24 h-24" />
      <div className="flex space-x-4">
        <Button className={button_class}>Cliente</Button>
        <Button className={button_class}>Project Manager</Button>
        <Button className={button_class}>Diseñador</Button>
      </div>
    </main>
  );
}

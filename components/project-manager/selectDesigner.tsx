"use client";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/context/UserContext/userContext"

interface DesignerProps {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: string;
 
}

const DesignerSelect: React.FC<{ designers?: DesignerProps[] }> = ({ designers = [] }) => {
  const { designerProjects, setDesignerProjects } = useUser();
  
  const [selectedDesigner, setSelectedDesigner] = React.useState<DesignerProps | null>(null);

  const handleSelectChange = (value: string) => {
    const designer = designers.find(d => d.id.toString() === value);
    setSelectedDesigner(designer || null);
    setDesignerProjects(designer || null);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 mt-10">
        <Select onValueChange={handleSelectChange} >
            <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a designer" />
            </SelectTrigger>
            <SelectContent>
            <SelectGroup>
                {designers.map(designer => (
                <SelectItem key={designer.id} value={designer.id.toString()}>{designer.name}</SelectItem>
                ))}
            </SelectGroup>
            </SelectContent>
        </Select>
      </div>

      {!selectedDesigner && (
        <Card className="w-[300px] h-[600px] mb-10">
          <CardHeader>
            <CardTitle>No designer selected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <span className="mb-2">Please select a designer</span>
              <img src="/GrayolaIcon.svg" alt="GrayolaIcon" className="h-[150px] w-full" />
            </div>
          </CardContent>
        </Card>
      )}
      
      {selectedDesigner && (
        <Card key={selectedDesigner.id} className="w-[300px] h-[600px] mb-10">
          <CardHeader>
            <CardTitle>{selectedDesigner.name}</CardTitle>
            <CardDescription>{selectedDesigner.email}</CardDescription>
            <CardDescription>{selectedDesigner.phone}</CardDescription>
            <CardDescription>{selectedDesigner.role}</CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};

export default DesignerSelect;

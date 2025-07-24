'use client'

import { useState } from "react";
import useSWR, { mutate } from 'swr';
import { PlusCircle } from "lucide-react";
import { CourseTable } from "@/components/admin/CourseTable";
import { Button } from "@/components/ui/button";
import { InternshipForm } from "@/components/admin/InternshipForm";
import type { IInternship } from "@/models/Internship";
import { useToast } from "@/hooks/use-toast";
import { fetcher } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminInternshipsPage() {
  const [editingInternship, setEditingInternship] = useState<IInternship | null>(null);
  const [view, setView] = useState<'table' | 'form'>('table');
  const { toast } = useToast();

  const { data, error, isLoading } = useSWR('/api/internships', fetcher);
  const internships: IInternship[] = data?.internships || [];

  const handleAddClick = () => {
    setEditingInternship(null);
    setView('form');
  };

  const handleEditClick = (internship: IInternship) => {
    setEditingInternship(internship);
    setView('form');
  };
  
  const handleDelete = async (internshipId: string) => {
    try {
      const res = await fetch(`/api/internships/${internshipId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete the internship.');
      }
      
      toast({ title: 'Success', description: 'Internship deleted successfully.' });
      mutate('/api/internships');
    } catch (error) {
       toast({
        title: 'Error',
        description: 'Could not delete the internship.',
        variant: 'destructive',
      });
      console.error(error);
    }
  };


  const handleSave = async () => {
    setView('table');
    mutate('/api/internships');
  };

  const handleCancel = () => {
    setView('table');
  };
  
  if (error) {
    toast({
        title: "Error",
        description: "Failed to load internships.",
        variant: "destructive"
    })
    return <div>Failed to load internships.</div>
  }

  return (
    <div className="space-y-6">
      {view === 'table' ? (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Manage Internships</h1>
            <Button onClick={handleAddClick}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Internship
            </Button>
          </div>
          {isLoading ? (
             <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
             </div>
          ) : (
            <CourseTable 
              listings={internships}
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />
          )}
        </>
      ) : (
        <>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{editingInternship ? 'Edit Internship' : 'Add New Internship'}</h1>
            <p className="text-muted-foreground">
              {editingInternship ? 'Update the details of the internship.' : 'Fill in the details to create a new internship.'}
            </p>
          </div>
          <InternshipForm internship={editingInternship} onSave={handleSave} onCancel={handleCancel} />
        </>
      )}
    </div>
  );
}

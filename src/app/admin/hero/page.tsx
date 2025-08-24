
'use client'

import { useState } from "react";
import useSWR, { mutate } from 'swr';
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IHeroSlide } from "@/models/HeroSlide";
import { useToast } from "@/hooks/use-toast";
import { fetcher } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { HeroSlideTable } from "@/components/admin/HeroSlideTable";
import { HeroSlideForm } from "@/components/admin/HeroSlideForm";

export default function AdminHeroPage() {
  const [editingSlide, setEditingSlide] = useState<IHeroSlide | null>(null);
  const [view, setView] = useState<'table' | 'form'>('table');
  const { toast } = useToast();

  const { data, error, isLoading } = useSWR('/api/heroslides', fetcher);
  const slides: IHeroSlide[] = data?.slides || [];

  const handleAddClick = () => {
    setEditingSlide(null);
    setView('form');
  };

  const handleEditClick = (slide: IHeroSlide) => {
    setEditingSlide(slide);
    setView('form');
  };
  
  const handleDelete = async (slideId: string) => {
    try {
      const res = await fetch(`/api/heroslides/${slideId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete the slide.');
      }
      
      toast({ title: 'Success', description: 'Hero slide deleted successfully.' });
      mutate('/api/heroslides');
    } catch (error) {
       toast({
        title: 'Error',
        description: 'Could not delete the slide.',
        variant: 'destructive',
      });
      console.error(error);
    }
  };

  const handleSave = async () => {
    setView('table');
    mutate('/api/heroslides');
  };

  const handleCancel = () => {
    setView('table');
  };
  
  if (error) {
    toast({
        title: "Error",
        description: "Failed to load hero slides.",
        variant: "destructive"
    })
    return <div>Failed to load hero slides.</div>
  }

  return (
    <div className="space-y-6">
      {view === 'table' ? (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Manage Hero Slides</h1>
            <Button onClick={handleAddClick}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Slide
            </Button>
          </div>
          {isLoading ? (
             <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
             </div>
          ) : (
            <HeroSlideTable 
              slides={slides}
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />
          )}
        </>
      ) : (
        <>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{editingSlide ? 'Edit Slide' : 'Add New Slide'}</h1>
            <p className="text-muted-foreground">
              {editingSlide ? 'Update the details of the hero slide.' : 'Fill in the details to create a new slide.'}
            </p>
          </div>
          <HeroSlideForm slide={editingSlide} onSave={handleSave} onCancel={handleCancel} />
        </>
      )}
    </div>
  );
}

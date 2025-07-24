
'use client'

import { useState } from "react";
import useSWR, { mutate } from 'swr';
import { PlusCircle } from "lucide-react";
import { CourseTable } from "@/components/admin/CourseTable";
import { Button } from "@/components/ui/button";
import { CourseForm } from "@/components/admin/CourseForm";
import type { ICourse } from "@/models/Course";
import { useToast } from "@/hooks/use-toast";
import { fetcher } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminCoursesPage() {
  const [editingCourse, setEditingCourse] = useState<ICourse | null>(null);
  const [view, setView] = useState<'table' | 'form'>('table');
  const { toast } = useToast();

  const { data, error, isLoading } = useSWR('/api/courses', fetcher);
  const courses: ICourse[] = data?.courses || [];

  const handleAddClick = () => {
    setEditingCourse(null);
    setView('form');
  };

  const handleEditClick = (course: ICourse) => {
    setEditingCourse(course);
    setView('form');
  };
  
  const handleDelete = async (courseId: string) => {
    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete the course.');
      }
      
      toast({ title: 'Success', description: 'Course deleted successfully.' });
      mutate('/api/courses'); // Revalidate the course list
    } catch (error) {
       toast({
        title: 'Error',
        description: 'Could not delete the course.',
        variant: 'destructive',
      });
      console.error(error);
    }
  };


  const handleSave = async () => {
    setView('table');
    mutate('/api/courses'); // Revalidate the course list
  };

  const handleCancel = () => {
    setView('table');
  };
  
  if (error) {
    toast({
        title: "Error",
        description: "Failed to load courses.",
        variant: "destructive"
    })
    return <div>Failed to load courses.</div>
  }

  return (
    <div className="space-y-6">
      {view === 'table' ? (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Manage Courses</h1>
            <Button onClick={handleAddClick}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Course
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
              listings={courses}
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />
          )}
        </>
      ) : (
        <>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{editingCourse ? 'Edit Course' : 'Add New Course'}</h1>
            <p className="text-muted-foreground">
              {editingCourse ? 'Update the details of the course.' : 'Fill in the details to create a new course.'}
            </p>
          </div>
          <CourseForm course={editingCourse} onSave={handleSave} onCancel={handleCancel} />
        </>
      )}
    </div>
  );
}

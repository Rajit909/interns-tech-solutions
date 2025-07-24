
'use client'

import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { CourseTable } from "@/components/admin/CourseTable";
import { Button } from "@/components/ui/button";
import { CourseDialog } from "@/components/admin/CourseDialog";
import type { ICourse } from "@/models/Course";
import { useToast } from "@/hooks/use-toast";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<ICourse | null>(null);
  const { toast } = useToast();

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses', { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch courses");
      const data = await res.json();
      setCourses(data.courses);
    } catch (error) {
      console.error("Error loading courses: ", error);
      toast({
        title: "Error",
        description: "Failed to load courses.",
        variant: "destructive"
      })
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAddClick = () => {
    setEditingCourse(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (course: ICourse) => {
    setEditingCourse(course);
    setIsDialogOpen(true);
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
      await fetchCourses(); // Refresh the list
    } catch (error) {
       toast({
        title: 'Error',
        description: 'Could not delete the course.',
        variant: 'destructive',
      });
      console.error(error);
    }
  };


  const handleDialogSave = async () => {
    await fetchCourses();
    setIsDialogOpen(false);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Manage Courses</h1>
        <Button onClick={handleAddClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      </div>
      
      <CourseTable 
        listings={courses}
        onEdit={handleEditClick}
        onDelete={handleDelete}
      />

      <CourseDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onSave={handleDialogSave}
        course={editingCourse}
      />
    </div>
  );
}

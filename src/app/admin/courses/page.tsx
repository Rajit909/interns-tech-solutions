import { PlusCircle } from "lucide-react";
import { CourseTable } from "@/components/admin/CourseTable";
import { listings } from "@/lib/mockData";
import { Button } from "@/components/ui/button";

export default function AdminCoursesPage() {
  const courses = listings.filter(l => l.type === 'Course');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Manage Courses</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      </div>
      <CourseTable listings={courses} />
    </div>
  );
}

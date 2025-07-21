import { PlusCircle } from "lucide-react";
import { CourseTable } from "@/components/admin/CourseTable";
import { Button } from "@/components/ui/button";
import type { ICourse } from "@/models/Course";

async function getCourses() {
  try {
    // This will be updated to a secure URL in production
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/courses`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch courses");
    }

    return res.json();
  } catch (error) {
    console.error("Error loading courses: ", error);
    return { courses: [] };
  }
}

export default async function AdminCoursesPage() {
  const { courses }: { courses: ICourse[] } = await getCourses();
  
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

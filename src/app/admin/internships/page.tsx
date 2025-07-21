import { PlusCircle } from "lucide-react";
import { CourseTable } from "@/components/admin/CourseTable";
import { Button } from "@/components/ui/button";
import type { IInternship } from "@/models/Internship";

async function getInternships() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/internships`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch internships");
    }

    return res.json();
  } catch (error) {
    console.error("Error loading internships: ", error);
    return { internships: [] };
  }
}

export default async function AdminInternshipsPage() {
    const { internships }: { internships: IInternship[] } = await getInternships();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Manage Internships</h1>
               <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Internship
                </Button>
            </div>
            <CourseTable listings={internships} />
        </div>
    );
}

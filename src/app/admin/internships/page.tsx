'use client';

import useSWR from 'swr';
import { PlusCircle } from "lucide-react";
import { CourseTable } from "@/components/admin/CourseTable";
import { Button } from "@/components/ui/button";
import type { IInternship } from "@/models/Internship";
import { fetcher } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

// Note: For now, the Add/Edit/Delete functionality for internships is not implemented.
// We are only reading the data. The onEdit and onDelete props will be no-ops.
export default function AdminInternshipsPage() {
    const { data, error, isLoading } = useSWR('/api/internships', fetcher);
    
    const internships: IInternship[] = data?.internships || [];

    if (error) return <div>Failed to load internships.</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Manage Internships</h1>
               <Button disabled>
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
                onEdit={() => {}} 
                onDelete={() => {}} 
              />
            )}
        </div>
    );
}

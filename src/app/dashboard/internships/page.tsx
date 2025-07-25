
'use client';

import useSWR from 'swr';
import { CourseCard } from "@/components/shared/CourseCard";
import { fetcher } from '@/lib/utils';
import type { IInternship } from '@/models/Internship';
import { Skeleton } from '@/components/ui/skeleton';


export default function InternshipsPage() {
    const { data, error, isLoading } = useSWR('/api/internships', fetcher);
    const internships: IInternship[] = data?.internships || [];

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">All Internships</h1>
                <p className="text-muted-foreground">Find your next opportunity with our exclusive internships.</p>
            </div>
            
            {isLoading && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-48 w-full" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))}
                </div>
            )}
            {error && <p className="text-destructive">Failed to load internships.</p>}
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {internships.map((listing) => (
                    <CourseCard key={(listing as any)._id} listing={listing} />
                ))}
            </div>
        </div>
    );
}

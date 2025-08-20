
'use client';

import useSWR from 'swr';
import { CourseCard } from "@/components/shared/CourseCard";
import { fetcher } from '@/lib/utils';
import type { ICourse } from '@/models/Course';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CoursesPage() {
    const { data, error, isLoading } = useSWR('/api/me/courses', fetcher);
    const enrolledCourses: ICourse[] = data?.courses || [];

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">My Enrolled Courses</h1>
                <p className="text-muted-foreground">Continue your learning journey with the courses you've enrolled in.</p>
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
            
            {!isLoading && error && <p className="text-destructive">Failed to load your courses.</p>}
            
            {!isLoading && !error && (
                enrolledCourses.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {enrolledCourses.map((listing) => (
                            <CourseCard key={(listing as any)._id} listing={listing} />
                        ))}
                    </div>
                ) : (
                     <Card>
                        <CardContent className="flex flex-col items-center justify-center p-10 text-center">
                            <p className="text-muted-foreground mb-4">You haven't enrolled in any courses yet.</p>
                            <Button asChild>
                                <Link href="/courses">Explore Courses</Link>
                            </Button>
                        </CardContent>
                    </Card>
                )
            )}
        </div>
    );
}

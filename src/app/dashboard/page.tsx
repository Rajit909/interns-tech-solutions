
'use client';

import useSWR from 'swr';
import { AiRecommender } from "@/components/student/AiRecommender";
import { CourseCard } from "@/components/shared/CourseCard";
import { Card, CardContent } from "@/components/ui/card";
import { fetcher } from '@/lib/utils';
import type { ICourse } from '@/models/Course';
import { Skeleton } from '@/components/ui/skeleton';

export default function StudentDashboardPage() {
    const { data, error, isLoading } = useSWR('/api/courses', fetcher);
    const enrolledCourses: ICourse[] = data?.courses || [];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Welcome back, Student!</h1>
                <p className="text-muted-foreground">Here's what's happening today.</p>
            </div>

            <AiRecommender />
            
            <section>
                <h2 className="text-2xl font-semibold tracking-tight mb-4">My Courses</h2>
                {isLoading && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                         {[...Array(2)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-48 w-full" />
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        ))}
                    </div>
                )}
                {error && <p className="text-destructive">Failed to load courses.</p>}
                {!isLoading && !error && (
                    enrolledCourses.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {enrolledCourses.slice(0, 2).map((listing) => (
                                <CourseCard key={(listing as any)._id} listing={listing} />
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-muted-foreground">You are not enrolled in any courses yet.</p>
                            </CardContent>
                        </Card>
                    )
                )}
            </section>
        </div>
    );
}


'use client';

import useSWR from 'swr';
import { AiRecommender } from "@/components/student/AiRecommender";
import { CourseCard } from "@/components/shared/CourseCard";
import { Card, CardContent } from "@/components/ui/card";
import { fetcher } from '@/lib/utils';
import type { ICourse } from '@/models/Course';
import { Skeleton } from '@/components/ui/skeleton';
import type { IUser } from '@/models/User';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function StudentDashboardPage() {
    const { data: coursesData, error: coursesError, isLoading: coursesLoading } = useSWR('/api/me/courses', fetcher);
    const { data: userData, isLoading: userLoading } = useSWR('/api/me', fetcher);
    
    const enrolledCourses: ICourse[] = coursesData?.courses || [];
    const user: IUser | null = userData?.user;

    const welcomeMessage = userLoading ? <Skeleton className="h-9 w-1/2" /> : <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || 'Student'}!</h1>;

    return (
        <div className="space-y-8">
            <div>
                {welcomeMessage}
                <p className="text-muted-foreground">Here's what's happening today.</p>
            </div>

            <AiRecommender />
            
            <section>
                <h2 className="text-2xl font-semibold tracking-tight mb-4">My Courses</h2>
                {coursesLoading && (
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
                {coursesError && <p className="text-destructive">Failed to load courses.</p>}
                {!coursesLoading && !coursesError && (
                    enrolledCourses.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {enrolledCourses.map((listing) => (
                                <CourseCard key={(listing as any)._id} listing={listing} />
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center p-10 text-center">
                                <p className="text-muted-foreground mb-4">You haven't enrolled in any courses yet.</p>
                                <Button asChild>
                                    <Link href="/dashboard/courses">Explore Courses</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )
                )}
            </section>
        </div>
    );
}

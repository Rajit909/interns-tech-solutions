
'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { fetcher } from '@/lib/utils';
import type { IQuiz } from '@/models/Quiz';
import type { ICourse } from '@/models/Course';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, ArrowRight } from 'lucide-react';

export default function QuizzesPage() {
    const { data: quizzesData, error: quizzesError, isLoading: quizzesLoading } = useSWR('/api/quizzes', fetcher);
    const { data: enrolledCoursesData, error: enrolledCoursesError, isLoading: enrolledCoursesLoading } = useSWR('/api/me/courses', fetcher);
    
    const allQuizzes: IQuiz[] = quizzesData?.quizzes || [];
    const enrolledCourses: ICourse[] = enrolledCoursesData?.courses || [];

    const isLoading = quizzesLoading || enrolledCoursesLoading;
    const error = quizzesError || enrolledCoursesError;

    const enrolledCourseIds = new Set(enrolledCourses.map(c => c._id));
    
    const relevantQuizzes = allQuizzes.filter(quiz => quiz.course && enrolledCourseIds.has(quiz.course.toString()));

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">My Quizzes</h1>
                <p className="text-muted-foreground">Test your knowledge for the courses you are enrolled in.</p>
            </div>
            
            {isLoading && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </CardHeader>
                            <CardFooter>
                                <Skeleton className="h-10 w-28" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
            {error && <p className="text-destructive">Failed to load quizzes.</p>}
            
            {!isLoading && !error && (
                relevantQuizzes.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {relevantQuizzes.map((quiz) => (
                            <Card key={(quiz as any)._id} className="flex flex-col">
                                <CardHeader className="flex-grow">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle>{quiz.title}</CardTitle>
                                            <CardDescription>{quiz.description}</CardDescription>
                                        </div>
                                        <HelpCircle className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                </CardHeader>
                                <CardFooter className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">{quiz.questions.length} Questions</span>
                                    <Button asChild>
                                        <Link href={`/dashboard/quizzes/${(quiz as any)._id}`}>
                                            Start Quiz <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="p-10 text-center">
                            <p className="text-muted-foreground">You don't have any quizzes available for your enrolled courses.</p>
                        </CardContent>
                    </Card>
                )
            )}
        </div>
    );
}

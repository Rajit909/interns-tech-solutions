
'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { notFound, useParams } from 'next/navigation';
import { fetcher, cn } from '@/lib/utils';
import type { ICourse, IModule, ILesson } from '@/models/Course';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PlayCircle, FileText, CheckCircle, Lock } from 'lucide-react';
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function CoursePlayerPage() {
  const params = useParams();
  const { data, error, isLoading } = useSWR(`/api/courses/${params.id}`, fetcher);
  
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const course: ICourse | undefined = data?.course;
  
  const activeLesson = useMemo(() => {
      if (!course) return null;
      if (activeLessonId) {
          for (const module of course.modules) {
              const lesson = module.lessons.find(l => l._id === activeLessonId);
              if (lesson) return lesson;
          }
      }
      return course.modules?.[0]?.lessons?.[0] || null;
  }, [course, activeLessonId]);
  
  const progress = useMemo(() => {
      if (!course) return 0;
      const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
      if (totalLessons === 0) return 0;
      return (completedLessons.size / totalLessons) * 100;
  }, [course, completedLessons]);

  const handleLessonClick = (lessonId: string) => {
    setActiveLessonId(lessonId);
  };
  
  const handleMarkComplete = () => {
    if (activeLesson) {
        setCompletedLessons(prev => new Set(prev).add(activeLesson._id));
    }
  };


  if (isLoading) return <PlayerSkeleton />;
  if (error || !course) return notFound();

  return (
    <div className="flex h-full flex-col lg:flex-row">
      {/* Main Content */}
      <div className="flex-1 lg:pr-6 xl:pr-8">
        <div className="flex-1 space-y-6">
           <div className="mb-4">
              <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
              <div className="mt-2 flex items-center gap-4">
                <Progress value={progress} className="w-full max-w-sm" />
                <span className="text-sm font-medium text-muted-foreground">{Math.round(progress)}% Complete</span>
              </div>
           </div>
          <Card className="overflow-hidden">
            {activeLesson ? (
              <>
                <AspectRatio ratio={16 / 9} className="bg-muted">
                  {activeLesson.type === 'video' ? (
                    <iframe
                      key={activeLesson._id}
                      src={activeLesson.content.replace('watch?v=', 'embed/')}
                      title="Course video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full"
                    ></iframe>
                  ) : (
                    <div className="p-6">
                      <div
                        className="prose prose-lg dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: activeLesson.content }}
                      />
                    </div>
                  )}
                </AspectRatio>
                <div className="p-6">
                  <h2 className="text-2xl font-bold">{activeLesson.title}</h2>
                   <Button 
                      onClick={handleMarkComplete} 
                      disabled={completedLessons.has(activeLesson._id)}
                      className="mt-4"
                    >
                      <CheckCircle className={cn("mr-2 h-4 w-4", completedLessons.has(activeLesson._id) && "text-green-400")} />
                      {completedLessons.has(activeLesson._id) ? "Completed" : "Mark as Complete"}
                    </Button>
                </div>
              </>
            ) : (
              <AspectRatio ratio={16 / 9} className="flex items-center justify-center bg-muted">
                <p className="text-muted-foreground">Select a lesson to begin your learning journey.</p>
              </AspectRatio>
            )}
          </Card>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-[350px] lg:shrink-0 mt-8 lg:mt-0">
        <Card className="sticky top-4 h-[calc(100vh-2rem)] overflow-hidden">
            <CardContent className="h-full overflow-y-auto p-4">
                <h2 className="text-xl font-bold mb-4">Course Content</h2>
                <Accordion type="multiple" defaultValue={course.modules.map(m => m._id)} className="w-full">
                {course.modules.map((module) => (
                    <AccordionItem value={module._id} key={module._id}>
                    <AccordionTrigger className="font-semibold text-base">{module.title}</AccordionTrigger>
                    <AccordionContent>
                        <ul className="space-y-1">
                        {module.lessons.map((lesson) => (
                            <li key={lesson._id}>
                            <button
                                className={cn(
                                'w-full rounded-md p-3 text-left text-sm transition-colors',
                                'flex items-center justify-between gap-3',
                                activeLesson?._id === lesson._id
                                    ? 'bg-primary/10 text-primary font-semibold'
                                    : 'hover:bg-muted/50'
                                )}
                                onClick={() => handleLessonClick(lesson._id)}
                            >
                                <div className="flex items-center gap-3">
                                    {lesson.type === 'video' ? (
                                        <PlayCircle className="h-4 w-4 shrink-0" />
                                    ) : (
                                        <FileText className="h-4 w-4 shrink-0" />
                                    )}
                                    <span className="flex-grow">{lesson.title}</span>
                                </div>
                                {completedLessons.has(lesson._id) && (
                                     <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
                                )}
                            </button>
                            </li>
                        ))}
                        </ul>
                    </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}


function PlayerSkeleton() {
    return (
      <div className="flex h-full flex-col lg:flex-row">
        {/* Main Content Skeleton */}
        <div className="flex-1 lg:pr-6 xl:pr-8">
            <div className="mb-4 space-y-2">
                <Skeleton className="h-9 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
            </div>
             <Card className="overflow-hidden">
                <Skeleton className="w-full aspect-video" />
                <div className="p-6">
                    <Skeleton className="h-8 w-3/4 mb-4" />
                    <Skeleton className="h-10 w-48" />
                </div>
            </Card>
        </div>
        
        {/* Sidebar Skeleton */}
        <div className="w-full lg:w-[350px] lg:shrink-0 mt-8 lg:mt-0">
             <Card className="sticky top-4 p-4 h-[calc(100vh-2rem)]">
                <Skeleton className="h-7 w-1/2 mb-4" />
                <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
             </Card>
        </div>
      </div>
    );
  }

    
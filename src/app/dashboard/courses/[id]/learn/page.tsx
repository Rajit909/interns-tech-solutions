
'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { notFound, useParams } from 'next/navigation';
import { fetcher, cn } from '@/lib/utils';
import type { ICourse, IModule, ILesson } from '@/models/Course';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PlayCircle, FileText, CheckCircle, Lock } from 'lucide-react';
import { AspectRatio } from "@/components/ui/aspect-ratio"

export default function CoursePlayerPage() {
  const params = useParams();
  const { data, error, isLoading } = useSWR(`/api/courses/${params.id}`, fetcher);
  
  const [activeLesson, setActiveLesson] = useState<ILesson | null>(null);

  if (isLoading) return <PlayerSkeleton />;
  if (error || !data || !data.course) return notFound();

  const course: ICourse = data.course;
  
  // Set the first lesson as active by default
  if (!activeLesson && course.modules?.[0]?.lessons?.[0]) {
      setActiveLesson(course.modules[0].lessons[0]);
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3 xl:w-3/4">
            <div className="bg-card rounded-lg overflow-hidden sticky top-4">
                 {activeLesson ? (
                    <>
                        <AspectRatio ratio={16 / 9} className="bg-muted">
                            {activeLesson.type === 'video' ? (
                                <iframe 
                                    key={activeLesson._id}
                                    src={activeLesson.content.replace("watch?v=", "embed/")} 
                                    title="YouTube video player" 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                    className="w-full h-full"
                                ></iframe>
                            ) : (
                               <div className="p-6">
                                 <h2 className="text-2xl font-bold mb-4">{activeLesson.title}</h2>
                                 <div className="prose dark:prose-invert max-w-none">{activeLesson.content}</div>
                               </div>
                            )}
                        </AspectRatio>
                        <div className="p-6">
                            <h1 className="text-2xl font-bold">{activeLesson.title}</h1>
                            <p className="text-muted-foreground mt-2">{course.title}</p>
                        </div>
                    </>
                 ) : (
                    <AspectRatio ratio={16 / 9} className="bg-muted flex items-center justify-center">
                        <p className="text-muted-foreground">Select a lesson to begin.</p>
                    </AspectRatio>
                 )}
            </div>
        </div>
        <div className="lg:w-1/3 xl:w-1/4">
             <div className="bg-card rounded-lg p-4 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Course Content</h2>
                <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
                    {course.modules.map((module, moduleIndex) => (
                        <AccordionItem value={`item-${moduleIndex}`} key={(module as any)._id}>
                            <AccordionTrigger className="font-semibold">{module.title}</AccordionTrigger>
                            <AccordionContent>
                                <ul className="space-y-1">
                                    {module.lessons.map((lesson, lessonIndex) => (
                                        <li key={(lesson as any)._id}>
                                            <button 
                                                className={cn(
                                                    "w-full text-left p-3 rounded-md flex items-center gap-3 text-sm transition-colors",
                                                    activeLesson?._id === (lesson as any)._id ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50"
                                                )}
                                                onClick={() => setActiveLesson(lesson)}
                                            >
                                                {lesson.type === 'video' ? <PlayCircle className="h-4 w-4 shrink-0" /> : <FileText className="h-4 w-4 shrink-0" />}
                                                <span className="flex-grow">{lesson.title}</span>
                                                <span className="text-xs text-muted-foreground">{lesson.duration}m</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
             </div>
        </div>
    </div>
  );
}


function PlayerSkeleton() {
    return (
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3 xl:w-3/4">
             <div className="bg-card rounded-lg overflow-hidden">
                <Skeleton className="w-full aspect-video" />
                <div className="p-6">
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <Skeleton className="h-5 w-1/2" />
                </div>
             </div>
        </div>
         <div className="lg:w-1/3 xl:w-1/4">
             <div className="bg-card rounded-lg p-4">
                <Skeleton className="h-7 w-1/2 mb-4" />
                <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
             </div>
        </div>
      </div>
    );
  }

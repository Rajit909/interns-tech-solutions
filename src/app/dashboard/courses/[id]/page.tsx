
'use client';

import Image from 'next/image';
import useSWR from 'swr';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Users, Bookmark, MessageSquare } from 'lucide-react';
import type { ICourse } from '@/models/Course';
import { fetcher } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const { data, error, isLoading } = useSWR(`/api/courses/${params.id}`, fetcher);

  if (isLoading) {
    return (
        <div className="container mx-auto max-w-5xl py-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-10 w-1/2" />
                    <Skeleton className="aspect-video w-full" />
                    <Skeleton className="h-40 w-full" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        </div>
    );
  }

  if (error || !data || !data.course) {
    // This will trigger the not-found.tsx page if it exists
    notFound();
  }
  
  const listing: ICourse = data.course;

  return (
    <div className="container mx-auto max-w-5xl py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <Badge variant="secondary">{listing.category}</Badge>
            <h1 className="font-headline text-4xl font-bold">{listing.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={`https://i.pravatar.cc/40?u=${listing.instructor}`} alt={listing.instructor} />
                  <AvatarFallback>{listing.instructor.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{listing.instructor}</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-5 w-5 fill-accent text-accent" />
                <span className="font-bold">{listing.rating}</span>
                <span className="text-muted-foreground">({listing.studentsEnrolled} students)</span>
              </div>
            </div>
            
            <Card>
                <CardContent className="p-0">
                    <Image src={listing.imageUrl} alt={listing.title} width={800} height={450} className="w-full rounded-t-lg object-cover" data-ai-hint="online learning" />
                </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>{listing.description}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-primary">${listing.price}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button size="lg" className="w-full">Enroll Now</Button>
              <Button size="lg" variant="outline" className="w-full">
                <Bookmark className="mr-2 h-4 w-4" />
                Save for Later
              </Button>
              <div className="space-y-2 pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" /> Duration</span>
                  <span className="font-semibold">{listing.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground"><Users className="h-4 w-4" /> Enrolled</span>
                  <span className="font-semibold">{listing.studentsEnrolled}</span>
                </div>
              </div>
            </CardContent>
            <CardContent>
                 <Button variant="secondary" className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact Instructor
                </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { ICourse } from '@/models/Course';
import type { IInternship } from '@/models/Internship';

type Listing = (ICourse | IInternship) & { _id: string };

type CourseCardProps = {
  listing: ICourse | IInternship;
};

export function CourseCard({ listing }: CourseCardProps) {
  const dbListing = listing as Listing;
  const isCourse = 'instructor' in dbListing;
  const pathname = usePathname();
  const isDashboard = pathname.includes('/dashboard');

  let detailUrl = '#';
  if (isCourse) {
    // If user is on dashboard, clicking a course card should lead to the dashboard detail page.
    // Otherwise, it should lead to the public preview page.
    detailUrl = isDashboard ? `/dashboard/courses/${dbListing._id}` : `/courses/${dbListing._id}`;
  } else {
    // Internships always go to the dashboard detail page as there's no public preview.
    detailUrl = `/dashboard/internships/${dbListing._id}`;
  }

  // Check if we are on the learn page specifically
  const onLearnPage = pathname.includes('/learn');
  
  let buttonText = "View Details";
  if(isCourse) {
      if (isDashboard) {
        buttonText = "Start Learning";
        detailUrl = `/dashboard/courses/${dbListing._id}/learn`;
      } else {
        buttonText = "View Course";
      }
  }
  if(!isCourse && isDashboard) {
      buttonText = "View Application";
  }


  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-lg shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <CardHeader className="relative p-0">
        <Link href={detailUrl}>
          <div className="relative h-48 w-full">
            <Image
              src={dbListing.imageUrl}
              alt={dbListing.title}
              fill
              className="object-cover"
              data-ai-hint={isCourse ? "online course" : "office internship"}
            />
          </div>
        </Link>
        <Badge variant="secondary" className="absolute right-3 top-3">
          {dbListing.category}
        </Badge>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <Link href={detailUrl} className="block">
          <CardTitle className="mb-2 line-clamp-2 h-[3.25rem] text-lg font-semibold leading-tight transition-colors hover:text-primary">
            {dbListing.title}
          </CardTitle>
        </Link>
        {isCourse ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Avatar className="h-6 w-6">
               <AvatarImage
                src={`https://i.pravatar.cc/40?u=${(dbListing as ICourse).instructor}`}
                alt={(dbListing as ICourse).instructor}
              />
              <AvatarFallback>{(dbListing as ICourse).instructor.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{(dbListing as ICourse).instructor}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <span>{(dbListing as IInternship).organization}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t p-4 text-sm">
        {isCourse ? (
          <>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-semibold">{(dbListing as ICourse).rating}</span>
              <span className="text-muted-foreground">
                ({(dbListing as ICourse).studentsEnrolled})
              </span>
            </div>
            <div className="text-lg font-bold text-primary">${(dbListing as ICourse).price}</div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{(dbListing as IInternship).location}</span>
            </div>
            <div className="font-semibold text-primary">{(dbListing as IInternship).stipend}</div>
          </>
        )}
      </CardFooter>
      <div className="p-4 pt-0">
        <Button asChild className="w-full">
            <Link href={detailUrl}>{buttonText}</Link>
        </Button>
      </div>
    </Card>
  );
}

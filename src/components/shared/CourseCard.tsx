import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin } from 'lucide-react';

import type { Listing } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type CourseCardProps = {
  listing: Listing;
};

export function CourseCard({ listing }: CourseCardProps) {
  const isCourse = listing.type === 'Course';
  const detailUrl = isCourse ? `/dashboard/courses/${listing.id}` : `/dashboard/internships/${listing.id}`;

  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-lg shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <CardHeader className="relative p-0">
        <Link href={detailUrl}>
          <div className="relative h-48 w-full">
            <Image
              src={listing.imageUrl}
              alt={listing.title}
              fill
              className="object-cover"
              data-ai-hint={isCourse ? "online course" : "office internship"}
            />
          </div>
        </Link>
        <Badge variant="secondary" className="absolute right-3 top-3">
          {listing.category}
        </Badge>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <Link href={detailUrl} className="block">
          <CardTitle className="mb-2 line-clamp-2 h-[3.25rem] text-lg font-semibold leading-tight transition-colors hover:text-primary">
            {listing.title}
          </CardTitle>
        </Link>
        {isCourse ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={`https://i.pravatar.cc/40?u=${listing.instructor}`}
                alt={listing.instructor}
              />
              <AvatarFallback>{listing.instructor.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{listing.instructor}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <span>{listing.organization}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t p-4 text-sm">
        {isCourse ? (
          <>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-semibold">{listing.rating}</span>
              <span className="text-muted-foreground">
                ({listing.studentsEnrolled})
              </span>
            </div>
            <div className="text-lg font-bold text-primary">${listing.price}</div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{listing.location}</span>
            </div>
            <div className="font-semibold text-primary">{listing.stipend}</div>
          </>
        )}
      </CardFooter>
      <div className="p-4 pt-0">
        <Button asChild className="w-full">
            <Link href={detailUrl}>View Details</Link>
        </Button>
      </div>
    </Card>
  );
}

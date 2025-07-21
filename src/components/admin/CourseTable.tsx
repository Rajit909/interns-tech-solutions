'use client'

import Image from 'next/image'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { ICourse } from '@/models/Course';
import type { IInternship } from '@/models/Internship';

// A helper type that makes the 'id' field available as '_id' for MongoDB documents
type DbListing = (ICourse | IInternship) & { _id: string };

type CourseTableProps = {
  listings: (ICourse | IInternship)[]
}

export function CourseTable({ listings }: CourseTableProps) {
  const allListings = Array.isArray(listings) ? listings : [];

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Listing</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Instructor/Org</TableHead>
                <TableHead className="hidden lg:table-cell">Stats</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allListings.map((listing) => {
                const dbListing = listing as DbListing;
                return (
                  <TableRow key={dbListing._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image src={listing.imageUrl} alt={listing.title} width={60} height={40} className="rounded-md object-cover" data-ai-hint="course thumbnail" />
                        <div>
                          <div className="font-medium">{listing.title}</div>
                          <div className="text-sm text-muted-foreground">{listing.type}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline">{listing.category}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{listing.type === 'Course' ? (listing as ICourse).instructor : (listing as IInternship).organization}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {listing.type === 'Course'
                        ? `${(listing as ICourse).studentsEnrolled} enrolled`
                        : `${(listing as IInternship).applicants} applicants`}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                            <span className="sr-only">Listing Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )})}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

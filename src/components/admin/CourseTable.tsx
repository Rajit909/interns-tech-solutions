
'use client'

import * as React from 'react'
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { ICourse } from '@/models/Course';
import type { IInternship } from '@/models/Internship';

type DbListing = (ICourse | IInternship) & { _id: string };

type CourseTableProps = {
  listings: (ICourse | IInternship)[]
  onEdit: (listing: ICourse | IInternship) => void;
  onDelete: (id: string) => void;
}

export function CourseTable({ listings, onEdit, onDelete }: CourseTableProps) {
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [selectedListingId, setSelectedListingId] = React.useState<string | null>(null);

  const allListings = Array.isArray(listings) ? listings : [];

  const handleDeleteClick = (id: string) => {
    setSelectedListingId(id);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (selectedListingId) {
      onDelete(selectedListingId);
    }
    setIsAlertOpen(false);
    setSelectedListingId(null);
  };


  return (
    <>
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Listing</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead className="hidden lg:table-cell">Instructor/Org</TableHead>
                <TableHead className="hidden md:table-cell">Stats</TableHead>
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
                        <Image src={listing.imageUrl} alt={listing.title} width={60} height={40} className="hidden rounded-md object-cover sm:block" data-ai-hint="course thumbnail" />
                        <div>
                          <div className="font-medium">{listing.title}</div>
                          <div className="text-sm text-muted-foreground">{listing.type}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline">{listing.category}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{listing.type === 'Course' ? (listing as ICourse).instructor : (listing as IInternship).organization}</TableCell>
                    <TableCell className="hidden md:table-cell">
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
                          <DropdownMenuItem onClick={() => onEdit(listing)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteClick(dbListing._id)}>
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
    
    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              listing from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

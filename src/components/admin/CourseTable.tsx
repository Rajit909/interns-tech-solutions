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
import { Card } from '@/components/ui/card'
import type { Listing } from '@/lib/types'

type CourseTableProps = {
  listings: Listing[]
}

export function CourseTable({ listings }: CourseTableProps) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Listing</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Instructor/Org</TableHead>
            <TableHead>Stats</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.map((listing) => (
            <TableRow key={listing.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Image src={listing.imageUrl} alt={listing.title} width={60} height={40} className="rounded-md object-cover" data-ai-hint="course thumbnail" />
                  <div>
                    <div className="font-medium">{listing.title}</div>
                    <div className="text-sm text-muted-foreground">{listing.type}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{listing.category}</Badge>
              </TableCell>
              <TableCell>{listing.type === 'Course' ? listing.instructor : listing.organization}</TableCell>
              <TableCell>
                {listing.type === 'Course'
                  ? `${listing.studentsEnrolled} enrolled`
                  : `${listing.applicants} applicants`}
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
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

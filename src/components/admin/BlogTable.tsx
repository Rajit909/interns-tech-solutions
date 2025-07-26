
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
import { Card, CardContent } from '@/components/ui/card'
import type { IBlog } from '@/models/Blog';
import { format } from 'date-fns'

type BlogTableProps = {
  posts: IBlog[];
  onEdit: (post: IBlog) => void;
  onDelete: (id: string) => void;
}

export function BlogTable({ posts, onEdit, onDelete }: BlogTableProps) {
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [selectedPostId, setSelectedPostId] = React.useState<string | null>(null);

  const allPosts = Array.isArray(posts) ? posts : [];

  const handleDeleteClick = (id: string) => {
    setSelectedPostId(id);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPostId) {
      onDelete(selectedPostId);
    }
    setIsAlertOpen(false);
    setSelectedPostId(null);
  };


  return (
    <>
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Post</TableHead>
                <TableHead className="hidden sm:table-cell">Author</TableHead>
                <TableHead className="hidden lg:table-cell">Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allPosts.map((post) => {
                const dbPost = post as IBlog & { _id: string };
                return (
                  <TableRow key={dbPost._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image src={dbPost.imageUrl} alt={dbPost.title} width={60} height={40} className="hidden rounded-md object-cover sm:block" data-ai-hint="blog thumbnail" />
                        <div>
                          <div className="font-medium">{dbPost.title}</div>
                          <div className="text-sm text-muted-foreground">{dbPost.slug}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {dbPost.author}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{format(new Date(dbPost.date), 'MMMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                            <span className="sr-only">Post Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(post)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteClick(dbPost._id)}>
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
              This action cannot be undone. This will permanently delete this
              blog post from the database.
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

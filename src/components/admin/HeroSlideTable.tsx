
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
import type { IHeroSlide } from '@/models/HeroSlide';

type HeroSlideTableProps = {
  slides: IHeroSlide[];
  onEdit: (slide: IHeroSlide) => void;
  onDelete: (id: string) => void;
}

export function HeroSlideTable({ slides, onEdit, onDelete }: HeroSlideTableProps) {
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [selectedSlideId, setSelectedSlideId] = React.useState<string | null>(null);

  const allSlides = Array.isArray(slides) ? slides : [];

  const handleDeleteClick = (id: string) => {
    setSelectedSlideId(id);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (selectedSlideId) {
      onDelete(selectedSlideId);
    }
    setIsAlertOpen(false);
    setSelectedSlideId(null);
  };

  return (
    <>
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Slide</TableHead>
                <TableHead className="hidden md:table-cell">Button</TableHead>
                <TableHead className="hidden lg:table-cell">Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allSlides.map((slide) => {
                const dbSlide = slide as IHeroSlide & { _id: string };
                return (
                  <TableRow key={dbSlide._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image src={dbSlide.imageUrl} alt={dbSlide.title} width={80} height={45} className="hidden rounded-md object-cover sm:block" data-ai-hint="hero slide" />
                        <div>
                          <div className="font-medium">{dbSlide.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">{dbSlide.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div>{dbSlide.buttonText}</div>
                      <div className="text-sm text-muted-foreground">{dbSlide.buttonLink}</div>
                    </TableCell>
                     <TableCell className="hidden lg:table-cell">
                        {dbSlide.order}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                            <span className="sr-only">Slide Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(slide)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteClick(dbSlide._id)}>
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
              hero slide from the database.
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

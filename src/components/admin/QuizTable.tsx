
'use client'

import * as React from 'react'
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
import type { IQuiz } from '@/models/Quiz';

type QuizTableProps = {
  quizzes: IQuiz[];
  onEdit: (quiz: IQuiz) => void;
  onDelete: (id: string) => void;
}

export function QuizTable({ quizzes, onEdit, onDelete }: QuizTableProps) {
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [selectedQuizId, setSelectedQuizId] = React.useState<string | null>(null);

  const allQuizzes = Array.isArray(quizzes) ? quizzes : [];

  const handleDeleteClick = (id: string) => {
    setSelectedQuizId(id);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (selectedQuizId) {
      onDelete(selectedQuizId);
    }
    setIsAlertOpen(false);
    setSelectedQuizId(null);
  };

  return (
    <>
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden sm:table-cell">Questions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allQuizzes.map((quiz) => {
                const dbQuiz = quiz as IQuiz & { _id: string };
                return (
                  <TableRow key={dbQuiz._id}>
                    <TableCell>
                      <div className="font-medium">{dbQuiz.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">{dbQuiz.description}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {dbQuiz.questions?.length || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                            <span className="sr-only">Quiz Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(quiz)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteClick(dbQuiz._id)}>
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
              This action cannot be undone. This will permanently delete this quiz.
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

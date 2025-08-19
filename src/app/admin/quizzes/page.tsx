
'use client'

import { useState } from "react";
import useSWR, { mutate } from 'swr';
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IQuiz } from "@/models/Quiz";
import { useToast } from "@/hooks/use-toast";
import { fetcher } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { QuizTable } from "@/components/admin/QuizTable";
import { QuizForm } from "@/components/admin/QuizForm";

export default function AdminQuizzesPage() {
  const [editingQuiz, setEditingQuiz] = useState<IQuiz | null>(null);
  const [view, setView] = useState<'table' | 'form'>('table');
  const { toast } = useToast();

  const { data, error, isLoading } = useSWR('/api/quizzes', fetcher);
  const quizzes: IQuiz[] = data?.quizzes || [];

  const handleAddClick = () => {
    setEditingQuiz(null);
    setView('form');
  };

  const handleEditClick = (quiz: IQuiz) => {
    setEditingQuiz(quiz);
    setView('form');
  };
  
  const handleDelete = async (quizId: string) => {
    try {
      const res = await fetch(`/api/quizzes/${quizId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete the quiz.');
      }
      
      toast({ title: 'Success', description: 'Quiz deleted successfully.' });
      mutate('/api/quizzes');
    } catch (error) {
       toast({
        title: 'Error',
        description: 'Could not delete the quiz.',
        variant: 'destructive',
      });
      console.error(error);
    }
  };

  const handleSave = async () => {
    setView('table');
    mutate('/api/quizzes');
  };

  const handleCancel = () => {
    setView('table');
  };
  
  if (error) {
    toast({
        title: "Error",
        description: "Failed to load quizzes.",
        variant: "destructive"
    })
    return <div>Failed to load quizzes.</div>
  }

  return (
    <div className="space-y-6">
      {view === 'table' ? (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Manage Quizzes</h1>
            <Button onClick={handleAddClick}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Quiz
            </Button>
          </div>
          {isLoading ? (
             <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
             </div>
          ) : (
            <QuizTable 
              quizzes={quizzes}
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />
          )}
        </>
      ) : (
        <>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{editingQuiz ? 'Edit Quiz' : 'Add New Quiz'}</h1>
            <p className="text-muted-foreground">
              {editingQuiz ? 'Update the details of the quiz.' : 'Fill in the details for a new quiz.'}
            </p>
          </div>
          <QuizForm quiz={editingQuiz} onSave={handleSave} onCancel={handleCancel} />
        </>
      )}
    </div>
  );
}

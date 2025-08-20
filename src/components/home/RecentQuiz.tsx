
'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { IQuiz } from '@/models/Quiz';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { QuizPopup } from '@/components/student/QuizPopup';

interface RecentQuizProps {
  quiz: IQuiz;
}

export function RecentQuiz({ quiz }: RecentQuizProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && quiz) {
      const popupShown = localStorage.getItem('quizPopupShown');
      if (!popupShown) {
        setShowPopup(true);
        localStorage.setItem('quizPopupShown', 'true');
      }
    }
  }, [isClient, quiz]);

  if (!quiz) {
    return null;
  }
  
  const handleOpenChange = (open: boolean) => {
    if (!open) {
        setShowPopup(false);
    }
  };


  return (
    <>
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle>{quiz.title}</CardTitle>
          <CardDescription>{quiz.description}</CardDescription>
        </CardHeader>
        <CardFooter className="flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {quiz.questions.length} questions to test your skills.
          </p>
          <Button asChild>
            <Link href={`/dashboard/quizzes/${(quiz as any)._id}`}>
                Take Quiz <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {isClient && (
         <Dialog open={showPopup} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
                <QuizPopup quiz={quiz} onFinish={() => setShowPopup(false)} />
            </DialogContent>
        </Dialog>
      )}
    </>
  );
}


'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import type { IQuiz } from '@/models/Quiz';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { QuizPopup } from '@/components/student/QuizPopup';

interface RecentQuizProps {
  quiz: IQuiz;
}

export function RecentQuiz({ quiz }: RecentQuizProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  if (!quiz) {
    return null;
  }

  const handleTakeQuiz = () => {
    setIsPopupOpen(true);
  };

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      setIsPopupOpen(false);
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
          <Button onClick={handleTakeQuiz}>
            Take Quiz <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isPopupOpen} onOpenChange={handleOnOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          {isPopupOpen && <QuizPopup quizId={(quiz as any)._id} onFinish={() => setIsPopupOpen(false)} />}
        </DialogContent>
      </Dialog>
    </>
  );
}

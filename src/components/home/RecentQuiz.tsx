
'use client';

import { ArrowRight, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { IQuiz } from '@/models/Quiz';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

interface RecentQuizProps {
  quiz: IQuiz;
}

export function RecentQuiz({ quiz }: RecentQuizProps) {
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (quiz) {
      const popupShown = localStorage.getItem('quizPopupShown');
      if (!popupShown) {
        setShowPopup(true);
        localStorage.setItem('quizPopupShown', 'true');
      }
    }
  }, [quiz]);

  if (!quiz) {
    return null;
  }
  
  const handleOpenChange = (open: boolean) => {
    if (!open) {
        setShowPopup(false);
    }
  };
  
  const handleRedirect = () => {
    setShowPopup(false);
    router.push(`/dashboard/quizzes/${(quiz as any)._id}`);
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

      <Dialog open={showPopup} onOpenChange={handleOpenChange}>
          <DialogContent className="max-w-md">
              <DialogHeader>
                  <div className="flex justify-center items-center h-12 w-12 rounded-full bg-primary/10 mx-auto mb-4">
                      <HelpCircle className="h-6 w-6 text-primary" />
                  </div>
                  <DialogTitle className="text-center">{quiz.title}</DialogTitle>
                  <DialogDescription className="text-center pt-2">
                      {quiz.description}
                      <br />
                      <span className="font-semibold text-foreground mt-2 block">{quiz.questions.length} questions to test your skills.</span>
                  </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-center pt-4">
                  <Button type="button" size="lg" onClick={handleRedirect}>
                      Take Quiz <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </>
  );
}

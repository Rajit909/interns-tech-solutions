
'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { IQuiz } from '@/models/Quiz';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface RecentQuizProps {
  quiz: IQuiz;
}

export function RecentQuiz({ quiz }: RecentQuizProps) {
  if (!quiz) {
    return null;
  }

  return (
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
  );
}

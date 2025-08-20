
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { IQuiz } from '@/models/Quiz';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Award } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface QuizPopupProps {
    quiz: IQuiz;
    onFinish: () => void;
}

export function QuizPopup({ quiz, onFinish }: QuizPopupProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  
  const questions = quiz.questions || [];

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setIsFinished(true);
  };
  
  const score = selectedAnswers.reduce((acc, answer, index) => {
    return answer === questions[index]?.correctAnswer ? acc + 1 : acc;
  }, 0);

  if (isFinished) {
    return <QuizResults quiz={quiz} score={score} selectedAnswers={selectedAnswers} onFinish={onFinish} />;
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return (
        <div className="flex flex-col h-full">
            <CardHeader>
                <CardTitle>No Questions Found</CardTitle>
                <CardDescription>This quiz does not have any questions yet.</CardDescription>
            </CardHeader>
            <CardFooter>
                 <Button onClick={onFinish}>Back to Quizzes</Button>
            </CardFooter>
        </div>
    )
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  return (
    <div className="flex flex-col h-full">
      <CardHeader>
          <Progress value={progress} className="mb-4" />
          <CardTitle>{quiz.title}</CardTitle>
          <CardDescription>Question {currentQuestionIndex + 1} of {questions.length}</CardDescription>
      </CardHeader>
      <ScrollArea className="flex-grow">
        <CardContent className="space-y-6 pr-6">
              <p className="text-lg font-semibold">{currentQuestion.text}</p>
              <RadioGroup 
                  onValueChange={(value) => handleAnswerSelect(parseInt(value))} 
                  value={selectedAnswers[currentQuestionIndex]?.toString()}
                  className="space-y-2"
              >
                  {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 rounded-md border p-3 has-[:checked]:border-primary">
                          <RadioGroupItem value={index.toString()} id={`popup-q${currentQuestionIndex}-o${index}`} />
                          <Label htmlFor={`popup-q${currentQuestionIndex}-o${index}`} className="flex-1 cursor-pointer">{option}</Label>
                      </div>
                  ))}
              </RadioGroup>
        </CardContent>
      </ScrollArea>
      <CardFooter className="flex justify-between pt-6 border-t mt-auto">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
              Previous
          </Button>
          {currentQuestionIndex < questions.length - 1 ? (
              <Button onClick={handleNext}>
                  Next
              </Button>
          ) : (
              <Button onClick={handleSubmit} disabled={selectedAnswers[currentQuestionIndex] === null || selectedAnswers[currentQuestionIndex] === undefined}>
                  Submit
              </Button>
          )}
      </CardFooter>
    </div>
  );
}

function QuizResults({ quiz, score, selectedAnswers, onFinish }: { quiz: IQuiz, score: number, selectedAnswers: (number | null)[], onFinish: () => void }) {
    const totalQuestions = quiz.questions.length;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    return (
        <div className="flex flex-col h-full">
            <CardHeader className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Award className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
                <CardDescription>You scored</CardDescription>
                <p className="text-6xl font-bold text-primary pt-2">{percentage}%</p>
                <p className="text-muted-foreground">({score} out of {totalQuestions} correct)</p>
            </CardHeader>
            <ScrollArea className="flex-grow">
                <CardContent>
                    <div className="space-y-6">
                        {quiz.questions.map((question, index) => {
                            const userAnswer = selectedAnswers[index];
                            const isCorrect = userAnswer === question.correctAnswer;
                            return (
                                <div key={index} className="space-y-2 border-b pb-4 last:border-b-0">
                                    <p className="font-semibold">{index + 1}. {question.text}</p>
                                    <div className="space-y-1">
                                        {question.options.map((option, optionIndex) => {
                                            const isUserChoice = userAnswer === optionIndex;
                                            const isTheCorrectAnswer = question.correctAnswer === optionIndex;

                                            return (
                                                <div 
                                                    key={optionIndex}
                                                    className={cn(
                                                        "flex items-center gap-2 rounded-md p-2 text-sm",
                                                        isTheCorrectAnswer && "bg-green-100 dark:bg-green-900/40",
                                                        isUserChoice && !isCorrect && "bg-red-100 dark:bg-red-900/40"
                                                    )}
                                                >
                                                    {isTheCorrectAnswer ? <CheckCircle className="h-4 w-4 text-green-600"/> : (isUserChoice ? <XCircle className="h-4 w-4 text-red-600"/> : <div className="h-4 w-4"/>)}
                                                    <span>{option}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </ScrollArea>
             <CardFooter className="justify-center pt-6 border-t mt-auto">
                <Button onClick={onFinish}>Finish Review</Button>
            </CardFooter>
        </div>
    );
}

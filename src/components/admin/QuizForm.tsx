
'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { Wand2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import type { IQuiz } from "@/models/Quiz"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { generateQuizQuestions } from "@/ai/flows/generate-quiz-questions-flow"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"

const QuestionSchema = z.object({
  text: z.string().min(1, "Question text cannot be empty."),
  options: z.array(z.string().min(1, "Option cannot be empty.")).length(4, "There must be 4 options."),
  correctAnswer: z.coerce.number().min(0).max(3),
});

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z.string().min(10, "Description is required."),
  questions: z.array(QuestionSchema).min(1, "At least one question is required."),
  aiTopic: z.string().optional(),
});

type QuizFormProps = {
  quiz?: IQuiz | null
  onSave: () => void
  onCancel: () => void;
}

export function QuizForm({ quiz, onSave, onCancel }: QuizFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: quiz?.title || "",
      description: quiz?.description || "",
      questions: quiz?.questions || [],
      aiTopic: "",
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "questions"
  });

  const handleGenerateQuestions = async () => {
    const topic = form.getValues("aiTopic");
    if (!topic) {
        toast({ title: "Topic is missing", description: "Please enter a topic for the AI.", variant: "destructive" });
        return;
    }
    setIsGenerating(true);
    try {
        const result = await generateQuizQuestions({ topic });
        replace(result.questions);
        toast({ title: "Success!", description: "AI has generated new questions." });
    } catch (error) {
        toast({ title: "Error", description: "Failed to generate questions.", variant: "destructive" });
    } finally {
        setIsGenerating(false);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSaving(true);
    try {
      const url = quiz ? `/api/quizzes/${(quiz as any)._id}` : '/api/quizzes';
      const method = quiz ? 'PUT' : 'POST';
      
      const finalValues = { ...values };
      // @ts-ignore
      delete finalValues.aiTopic;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalValues),
      });

      if (!res.ok) throw new Error(quiz ? 'Failed to update quiz' : 'Failed to create quiz');

      toast({ title: "Success!", description: `Quiz has been ${quiz ? 'updated' : 'created'}.` });
      onSave();
    } catch (error) {
       toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
        setIsSaving(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Quiz Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                        <Input placeholder="React Basics Quiz" {...field} disabled={isSaving || isGenerating}/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Test your knowledge on the fundamentals of React." {...field} disabled={isSaving || isGenerating}/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Questions</CardTitle>
                <FormDescription>Manage the questions for this quiz.</FormDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2 rounded-md border border-input p-4">
                    <Label>AI Question Generator</Label>
                    <div className="flex items-center gap-2">
                         <FormField
                            control={form.control}
                            name="aiTopic"
                            render={({ field }) => (
                                <FormItem className="flex-grow">
                                    <FormControl>
                                        <Input placeholder="e.g. React Hooks" {...field} disabled={isSaving || isGenerating} />
                                    </FormControl>
                                </FormItem>
                            )}
                         />
                        <Button type="button" variant="outline" onClick={handleGenerateQuestions} disabled={isSaving || isGenerating}>
                            <Wand2 className="mr-2 h-4 w-4" />
                            {isGenerating ? 'Generating...' : 'Generate Questions'}
                        </Button>
                    </div>
                    <FormDescription>This will replace all existing questions.</FormDescription>
                 </div>

                {fields.map((field, index) => (
                    <div key={field.id} className="space-y-4 rounded-md border p-4 relative">
                        <FormField
                            control={form.control}
                            name={`questions.${index}.text`}
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Question {index + 1}</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isSaving || isGenerating}/>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`questions.${index}.correctAnswer`}
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Options</FormLabel>
                                <FormControl>
                                     <RadioGroup
                                        onValueChange={(value) => field.onChange(parseInt(value))}
                                        value={String(field.value)}
                                        className="space-y-2"
                                        disabled={isSaving || isGenerating}
                                    >
                                        {[0,1,2,3].map((optionIndex) => (
                                             <div key={optionIndex} className="flex items-center gap-2">
                                                <RadioGroupItem value={String(optionIndex)} id={`q${index}-o${optionIndex}`} />
                                                <FormField
                                                    control={form.control}
                                                    name={`questions.${index}.options.${optionIndex}`}
                                                    render={({ field: optionField }) => (
                                                        <FormItem className="flex-grow">
                                                            <FormControl>
                                                                <Input {...optionField} placeholder={`Option ${optionIndex + 1}`} disabled={isSaving || isGenerating}/>
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormDescription>Select the correct answer.</FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-7 w-7"
                            onClick={() => remove(index)}
                            disabled={isSaving || isGenerating}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                 <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ text: '', options: ['', '', '', ''], correctAnswer: 0 })}
                    disabled={isSaving || isGenerating}
                >
                    Add Question
                </Button>
            </CardContent>
        </Card>

        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving || isGenerating}>
                Cancel
            </Button>
            <Button type="submit" disabled={isSaving || isGenerating}>
                {isSaving ? 'Saving...' : 'Save Quiz'}
            </Button>
        </div>
      </form>
    </Form>
  )
}

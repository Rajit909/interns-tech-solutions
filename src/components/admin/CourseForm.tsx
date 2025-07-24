
'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import type { ICourse } from "@/models/Course"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Wand2 } from "lucide-react"
import { generateImage } from "@/ai/flows/generate-image-flow"
import { Textarea } from "@/components/ui/textarea"
import { suggestCourseDetails } from "@/ai/flows/suggest-course-details-flow"

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  category: z.string().min(2, "Category is required."),
  instructor: z.string().min(2, "Instructor name is required."),
  description: z.string().min(10, "Description must be at least 10 characters.").trim(),
  duration: z.string().min(1, "Duration is required."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  rating: z.coerce.number().min(0).max(5, "Rating must be between 0 and 5.").optional().default(0),
  studentsEnrolled: z.coerce.number().min(0, "Students enrolled must be a positive number.").optional().default(0),
  imageUrl: z.string().url("Please enter a valid URL or generate one."),
  bannerPrompt: z.string().optional().default(''),
});

type CourseFormProps = {
  course?: ICourse | null
  onSave: () => void
  onCancel: () => void;
}

export function CourseForm({ course, onSave, onCancel }: CourseFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isAutofilling, setIsAutofilling] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: course?.title || "",
      category: course?.category || "",
      instructor: course?.instructor || "",
      description: course?.description || "",
      duration: course?.duration || "",
      price: course?.price || 0,
      rating: course?.rating || 0,
      studentsEnrolled: course?.studentsEnrolled || 0,
      imageUrl: course?.imageUrl || "",
      bannerPrompt: 'A professional and engaging course banner for the course.'
    },
  })
  
  const handleAutofill = async () => {
    const title = form.getValues("title");
    if (!title) {
        toast({
            title: "Title is missing",
            description: "Please enter a course title before using AI Autofill.",
            variant: "destructive"
        });
        return;
    }
    setIsAutofilling(true);
    try {
        const result = await suggestCourseDetails({ title });
        form.setValue("category", result.category, { shouldValidate: true });
        form.setValue("instructor", result.instructor, { shouldValidate: true });
        form.setValue("description", result.description, { shouldValidate: true });
        form.setValue("duration", result.duration, { shouldValidate: true });
        form.setValue("price", result.price, { shouldValidate: true });
        form.setValue("bannerPrompt", result.bannerPrompt, { shouldValidate: true });
        toast({ title: "Success!", description: "AI has filled in the course details." });
    } catch (error) {
        toast({
            title: "Error",
            description: "Failed to generate AI details.",
            variant: "destructive"
        });
        console.error("Autofill failed:", error);
    } finally {
        setIsAutofilling(false);
    }
  }


  const handleGenerateImage = async () => {
    const bannerPrompt = form.getValues("bannerPrompt") || form.getValues("title");
     if (!bannerPrompt) {
        toast({
            title: "Title is missing",
            description: "Please enter a course title or have an AI-generated prompt before generating an image.",
            variant: "destructive"
        });
        return;
    }
    setIsGeneratingImage(true);
    try {
        const result = await generateImage({ prompt: bannerPrompt });
        form.setValue("imageUrl", result.imageUrl, { shouldValidate: true });
        toast({ title: "Success!", description: "AI banner generated successfully." });
    } catch (error) {
        toast({
            title: "Error",
            description: "Failed to generate AI banner.",
            variant: "destructive"
        });
        console.error("Image generation failed:", error);
    } finally {
        setIsGeneratingImage(false);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSaving(true);
    try {
      const url = course ? `/api/courses/${(course as any)._id}` : '/api/courses';
      const method = course ? 'PUT' : 'POST';

      const finalValues = { ...values };
      // @ts-ignore
      delete finalValues.bannerPrompt;


      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalValues),
      });

      if (!res.ok) {
        throw new Error(course ? 'Failed to update course' : 'Failed to create course');
      }

      toast({
        title: "Success!",
        description: `Course has been ${course ? 'updated' : 'created'} successfully.`,
      });
      onSave();
    } catch (error) {
       toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive"
      });
    } finally {
        setIsSaving(false);
    }
  }
  
  const isGenerating = isGeneratingImage || isAutofilling;

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                   <div className="flex items-center gap-2">
                    <FormControl>
                      <Input placeholder="Advanced React" {...field} disabled={isGenerating}/>
                    </FormControl>
                    <Button type="button" variant="outline" onClick={handleAutofill} disabled={isGenerating}>
                        <Wand2 className="mr-2 h-4 w-4" />
                        {isAutofilling ? 'Thinking...' : 'AI Autofill'}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="Web Development" {...field} disabled={isGenerating} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instructor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructor</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" {...field} disabled={isGenerating}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A deep dive into React hooks..."
                      className="min-h-[150px]"
                      {...field}
                      disabled={isGenerating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                        <Input placeholder="8 Weeks" {...field} disabled={isGenerating}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                        <Input type="number" placeholder="199.99" {...field} disabled={isGenerating}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
             <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Banner URL</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input placeholder="https://placehold.co/600x400.png" {...field} disabled={isGenerating}/>
                    </FormControl>
                    <Button type="button" variant="outline" onClick={handleGenerateImage} disabled={isGenerating}>
                        <Wand2 className="mr-2 h-4 w-4" />
                        {isGeneratingImage ? 'Generating...' : 'AI Generate'}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSaving || isGenerating}>
                    {isSaving ? 'Saving...' : 'Save Course'}
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

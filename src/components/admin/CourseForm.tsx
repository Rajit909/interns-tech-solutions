
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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { ICourse } from "@/models/Course"
import { useState } from "react"

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  category: z.string().min(2, "Category is required."),
  instructor: z.string().min(2, "Instructor name is required."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  duration: z.string().min(1, "Duration is required."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  rating: z.coerce.number().min(0).max(5, "Rating must be between 0 and 5."),
  studentsEnrolled: z.coerce.number().min(0, "Students enrolled must be a positive number."),
  imageUrl: z.string().url("Please enter a valid URL."),
});

type CourseFormProps = {
  course?: ICourse | null
  onSave: () => void
}

export function CourseForm({ course, onSave }: CourseFormProps) {
  const [isLoading, setIsLoading] = useState(false);
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
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const url = course ? `/api/courses/${(course as any)._id}` : '/api/courses';
      const method = course ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
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
        setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Advanced React" {...field} />
              </FormControl>
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
                  <Input placeholder="Web Development" {...field} />
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
                  <Input placeholder="Jane Doe" {...field} />
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
                <Textarea placeholder="A deep dive into React hooks..." {...field} />
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
                    <Input placeholder="8 Weeks" {...field} />
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
                    <Input type="number" placeholder="199.99" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                    <Input type="number" step="0.1" placeholder="4.8" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="studentsEnrolled"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Students Enrolled</FormLabel>
                    <FormControl>
                    <Input type="number" placeholder="1204" {...field} />
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
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://placehold.co/600x400.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Course'}</Button>
      </form>
    </Form>
  )
}

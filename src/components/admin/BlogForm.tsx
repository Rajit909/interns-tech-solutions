
'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Wand2 } from "lucide-react"
import dynamic from "next/dynamic"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import type { IBlog } from "@/models/Blog"
import { Card, CardContent } from "@/components/ui/card"
import { generateImage } from "@/ai/flows/generate-image-flow"
import { Textarea } from "@/components/ui/textarea"
import { suggestBlogDetails } from "@/ai/flows/suggest-blog-details-flow"
import { cn } from "@/lib/utils"

const RichTextEditor = dynamic(() => import('../shared/RichTextEditor'), { ssr: false });

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  slug: z.string().min(2, "Slug must be at least 2 characters."),
  author: z.string().min(2, "Author name is required."),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters.").trim(),
  content: z.string().min(20, "Content must be at least 20 characters.").trim(),
  imageUrl: z.string().url("Please enter a valid URL or generate one."),
  readTime: z.string().min(1, "Read time is required."),
  dataAiHint: z.string().optional(),
  status: z.enum(["draft", "published", "scheduled"], {
    required_error: "You need to select a status.",
  }),
  publishDate: z.date({
    required_error: "A publication date is required.",
  }),
});

type BlogFormProps = {
  post?: IBlog | null
  onSave: () => void
  onCancel: () => void;
}

export function BlogForm({ post, onSave, onCancel }: BlogFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isAutofilling, setIsAutofilling] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      author: post?.author || "Intern Tech Solutions",
      excerpt: post?.excerpt || "",
      content: post?.content || "",
      imageUrl: post?.imageUrl || "",
      readTime: post?.readTime || "5 min read",
      dataAiHint: post?.dataAiHint || "",
      status: post?.status || "draft",
      publishDate: post?.publishDate ? new Date(post.publishDate) : new Date(),
    },
  })

  // Auto-generate slug from title
  const title = form.watch("title");
  useEffect(() => {
    if (title && !post) { // Only auto-slug for new posts
        const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        form.setValue("slug", slug, { shouldValidate: true });
    }
  }, [title, form, post]);

  const status = form.watch("status");
  useEffect(() => {
    if (status === 'published' || status === 'draft') {
        form.setValue("publishDate", new Date());
    }
  }, [status, form]);

  const handleAutofill = async () => {
    const titleValue = form.getValues("title");
    if (!titleValue) {
        toast({
            title: "Title is missing",
            description: "Please enter a blog post title before using AI Autofill.",
            variant: "destructive"
        });
        return;
    }
    setIsAutofilling(true);
    try {
        const result = await suggestBlogDetails({ title: titleValue });
        form.setValue("excerpt", result.excerpt, { shouldValidate: true });
        form.setValue("content", result.content, { shouldValidate: true });
        toast({ title: "Success!", description: "AI has filled in the blog details." });
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
    const promptValue = form.getValues("title");
     if (!promptValue) {
        toast({
            title: "Title is missing",
            description: "Please enter a blog post title before generating an image.",
            variant: "destructive"
        });
        return;
    }
    setIsGeneratingImage(true);
    try {
        const result = await generateImage({ prompt: `A professional blog post banner image for an article titled: "${promptValue}"` });
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
      const url = post ? `/api/blogs/${(post as any)._id}` : '/api/blogs';
      const method = post ? 'PUT' : 'POST';

      const finalValues = { ...values };
      if (finalValues.status === 'published') {
        finalValues.publishDate = new Date();
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalValues),
      });

      if (!res.ok) {
        throw new Error(post ? 'Failed to update post' : 'Failed to create post');
      }

      toast({
        title: "Success!",
        description: `Blog post has been ${post ? 'updated' : 'created'} successfully.`,
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                   <div className="flex items-center gap-2">
                    <FormControl>
                      <Input placeholder="How to Ace Your Technical Interview" {...field} disabled={isGenerating}/>
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
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="how-to-ace-your-technical-interview" {...field} disabled={isGenerating} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
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
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A short summary of the blog post..."
                      {...field}
                      disabled={isGenerating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                     <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      readOnly={isGenerating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField
                  control={form.control}
                  name="readTime"
                  render={({ field }) => (
                  <FormItem>
                      <FormLabel>Read Time</FormLabel>
                      <FormControl>
                      <Input placeholder="7 min read" {...field} disabled={isGenerating}/>
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                  )}
              />
              <FormField
                  control={form.control}
                  name="dataAiHint"
                  render={({ field }) => (
                  <FormItem>
                      <FormLabel>Image AI Hint</FormLabel>
                      <FormControl>
                      <Input placeholder="interview preparation" {...field} disabled={isGenerating}/>
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
                  <FormLabel>Banner URL</FormLabel>
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
             <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                        disabled={isGenerating}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="draft" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Draft
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="published" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Published
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="scheduled" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Scheduled
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               {status === 'scheduled' && (
                  <FormField
                    control={form.control}
                    name="publishDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Publication Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                                disabled={isGenerating}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0,0,0,0)) || isGenerating
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          The post will be published on this date.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving || isGenerating}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSaving || isGenerating}>
                    {isSaving ? 'Saving...' : 'Save Post'}
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

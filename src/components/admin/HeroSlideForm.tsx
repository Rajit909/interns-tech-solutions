
'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { Wand2 } from "lucide-react"

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
import type { IHeroSlide } from "@/models/HeroSlide"
import { Card, CardContent } from "@/components/ui/card"
import { generateImage } from "@/ai/flows/generate-image-flow"
import { Textarea } from "@/components/ui/textarea"
import { suggestHeroSlideDetails } from "@/ai/flows/suggest-hero-slide-details-flow"

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters.").trim(),
  buttonText: z.string().min(2, "Button text is required."),
  buttonLink: z.string().min(1, "Button link is required."),
  imageUrl: z.string().url("Please enter a valid URL or generate one."),
  dataAiHint: z.string().optional(),
  order: z.coerce.number().default(0),
  topic: z.string().optional(), // For AI generation only
});

type HeroSlideFormProps = {
  slide?: IHeroSlide | null
  onSave: () => void
  onCancel: () => void;
}

export function HeroSlideForm({ slide, onSave, onCancel }: HeroSlideFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isAutofilling, setIsAutofilling] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: slide?.title || "",
      description: slide?.description || "",
      buttonText: slide?.buttonText || "",
      buttonLink: slide?.buttonLink || "",
      imageUrl: slide?.imageUrl || "",
      dataAiHint: slide?.dataAiHint || "",
      order: slide?.order || 0,
      topic: "",
    },
  })

  const handleAutofill = async () => {
    const topicValue = form.getValues("topic");
    if (!topicValue) {
        toast({
            title: "Topic is missing",
            description: "Please enter a topic before using AI Autofill.",
            variant: "destructive"
        });
        return;
    }
    setIsAutofilling(true);
    try {
        const result = await suggestHeroSlideDetails({ topic: topicValue });
        form.setValue("title", result.title, { shouldValidate: true });
        form.setValue("description", result.description, { shouldValidate: true });
        form.setValue("buttonText", result.buttonText, { shouldValidate: true });
        form.setValue("buttonLink", result.buttonLink, { shouldValidate: true });
        form.setValue("dataAiHint", result.dataAiHint, { shouldValidate: true });
        toast({ title: "Success!", description: "AI has filled in the slide details." });
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
    const promptValue = form.getValues("dataAiHint") || form.getValues("title");
     if (!promptValue) {
        toast({
            title: "Hint or Title is missing",
            description: "Please enter a title or AI hint before generating an image.",
            variant: "destructive"
        });
        return;
    }
    setIsGeneratingImage(true);
    try {
        const result = await generateImage({ prompt: `A stunning, high-resolution hero image for a website banner. The theme is: "${promptValue}". The image should be professional, inspiring, and visually captivating.` });
        form.setValue("imageUrl", result.imageUrl, { shouldValidate: true });
        toast({ title: "Success!", description: "AI hero image generated successfully." });
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
      const url = slide ? `/api/heroslides/${(slide as any)._id}` : '/api/heroslides';
      const method = slide ? 'PUT' : 'POST';
      
      const finalValues = { ...values };
      // @ts-ignore
      delete finalValues.topic;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalValues),
      });

      if (!res.ok) {
        throw new Error(slide ? 'Failed to update slide' : 'Failed to create slide');
      }

      toast({
        title: "Success!",
        description: `Hero slide has been ${slide ? 'updated' : 'created'} successfully.`,
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
                name="topic"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>AI Autofill Topic</FormLabel>
                    <div className="flex items-center gap-2">
                        <FormControl>
                        <Input placeholder="e.g., 'A new course on AI Development'" {...field} disabled={isGenerating}/>
                        </FormControl>
                        <Button type="button" variant="outline" onClick={handleAutofill} disabled={isGenerating}>
                            <Wand2 className="mr-2 h-4 w-4" />
                            {isAutofilling ? 'Thinking...' : 'AI Autofill'}
                        </Button>
                    </div>
                    <FormDescription>
                        Enter a topic and let AI generate the content for this slide.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Find Your Future. Today." {...field} disabled={isGenerating}/>
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
                    <Textarea
                      placeholder="Our platform is your gateway to top-tier online courses..."
                      {...field}
                      disabled={isGenerating}
                      className="min-h-24"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="buttonText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Button Text</FormLabel>
                    <FormControl>
                      <Input placeholder="Explore Courses" {...field} disabled={isGenerating} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="buttonLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Button Link</FormLabel>
                    <FormControl>
                      <Input placeholder="#courses" {...field} disabled={isGenerating}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="dataAiHint"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Image AI Hint</FormLabel>
                        <FormControl>
                        <Input placeholder="students learning" {...field} disabled={isGenerating}/>
                        </FormControl>
                         <FormDescription>A hint for the AI image generator.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Display Order</FormLabel>
                        <FormControl>
                         <Input type="number" placeholder="0" {...field} disabled={isGenerating} />
                        </FormControl>
                         <FormDescription>Lower numbers appear first.</FormDescription>
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
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input placeholder="https://placehold.co/1920x800.png" {...field} disabled={isGenerating}/>
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
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving || isGenerating}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSaving || isGenerating}>
                    {isSaving ? 'Saving...' : 'Save Slide'}
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

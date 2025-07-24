
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
import type { IInternship } from "@/models/Internship"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Wand2 } from "lucide-react"
import { generateImage } from "@/ai/flows/generate-image-flow"
import { Textarea } from "@/components/ui/textarea"
import { suggestInternshipDetails } from "@/ai/flows/suggest-internship-details-flow"

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  category: z.string().min(2, "Category is required."),
  organization: z.string().min(2, "Organization name is required."),
  description: z.string().min(10, "Description must be at least 10 characters.").trim(),
  duration: z.string().min(1, "Duration is required."),
  stipend: z.string().min(1, "Stipend is required."),
  location: z.string().min(2, "Location is required."),
  applicants: z.coerce.number().min(0, "Applicants must be a positive number.").optional().default(0),
  imageUrl: z.string().url("Please enter a valid URL or generate one."),
  bannerPrompt: z.string().optional().default(''),
});

type InternshipFormProps = {
  internship?: IInternship | null
  onSave: () => void
  onCancel: () => void;
}

export function InternshipForm({ internship, onSave, onCancel }: InternshipFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isAutofilling, setIsAutofilling] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: internship?.title || "",
      category: internship?.category || "",
      organization: internship?.organization || "",
      description: internship?.description || "",
      duration: internship?.duration || "",
      stipend: internship?.stipend || "",
      location: internship?.location || "",
      applicants: internship?.applicants || 0,
      imageUrl: internship?.imageUrl || "",
      bannerPrompt: 'A professional and modern banner for an internship opportunity.'
    },
  })
  
  const handleAutofill = async () => {
    const title = form.getValues("title");
    if (!title) {
        toast({
            title: "Title is missing",
            description: "Please enter an internship title before using AI Autofill.",
            variant: "destructive"
        });
        return;
    }
    setIsAutofilling(true);
    try {
        const result = await suggestInternshipDetails({ title });
        form.setValue("category", result.category, { shouldValidate: true });
        form.setValue("organization", result.organization, { shouldValidate: true });
        form.setValue("description", result.description, { shouldValidate: true });
        form.setValue("duration", result.duration, { shouldValidate: true });
        form.setValue("stipend", result.stipend, { shouldValidate: true });
        form.setValue("location", result.location, { shouldValidate: true });
        form.setValue("bannerPrompt", result.bannerPrompt, { shouldValidate: true });
        toast({ title: "Success!", description: "AI has filled in the internship details." });
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
            description: "Please enter a title or have an AI-generated prompt before generating an image.",
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
      const url = internship ? `/api/internships/${(internship as any)._id}` : '/api/internships';
      const method = internship ? 'PUT' : 'POST';

      const finalValues = { ...values, type: 'Internship' };
      // @ts-ignore
      delete finalValues.bannerPrompt;


      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalValues),
      });

      if (!res.ok) {
        throw new Error(internship ? 'Failed to update internship' : 'Failed to create internship');
      }

      toast({
        title: "Success!",
        description: `Internship has been ${internship ? 'updated' : 'created'} successfully.`,
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
                      <Input placeholder="Frontend Developer Intern" {...field} />
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
                      <Input placeholder="Software Engineering" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization</FormLabel>
                    <FormControl>
                      <Input placeholder="Innovate Inc." {...field} />
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
                      placeholder="Join our dynamic team to build cutting-edge web applications..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                        <Input placeholder="3 Months" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="stipend"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Stipend</FormLabel>
                        <FormControl>
                        <Input placeholder="$2500/month" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                        <Input placeholder="Remote" {...field} />
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
                      <Input placeholder="https://placehold.co/600x400.png" {...field} />
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
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving || isGenerating}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSaving || isGenerating}>
                    {isSaving ? 'Saving...' : 'Save Internship'}
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

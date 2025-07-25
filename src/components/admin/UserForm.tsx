
'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { IUser } from "@/models/User"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Wand2 } from "lucide-react"
import { generateImage } from "@/ai/flows/generate-image-flow"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters.").optional().or(z.literal('')),
  role: z.enum(["student", "admin", "instructor"]),
  imageUrl: z.string().url().optional(),
});

type UserFormProps = {
  user?: IUser | null
  onSave: () => void
  onCancel: () => void;
}

export function UserForm({ user, onSave, onCancel }: UserFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      role: user?.role || "student",
      imageUrl: user?.imageUrl || "",
    },
  });

  // Modify the schema if we are editing a user to make password optional
  const finalFormSchema = user 
    ? formSchema.partial().extend({ email: z.string().email().optional() }) 
    : formSchema;

  const handleGenerateImage = async () => {
    const name = form.getValues("name");
    if (!name) {
        toast({
            title: "Name is missing",
            description: "Please enter a name before generating an image.",
            variant: "destructive"
        });
        return;
    }
    setIsGeneratingImage(true);
    try {
        const result = await generateImage({ prompt: `A professional, friendly avatar for a user named ${name}` });
        form.setValue("imageUrl", result.imageUrl, { shouldValidate: true });
        toast({ title: "Success!", description: "AI avatar generated successfully." });
    } catch (error) {
        toast({
            title: "Error",
            description: "Failed to generate AI avatar.",
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
      const url = user ? `/api/users/${(user as any)._id}` : '/api/users';
      const method = user ? 'PUT' : 'POST';

      let body = { ...values };
      // Don't send an empty password field on updates
      if (user && !body.password) {
        delete body.password;
      }
      
      if (!body.imageUrl) {
        body.imageUrl = `https://i.pravatar.cc/40?u=${body.email}`;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || (user ? 'Failed to update user' : 'Failed to create user'));
      }

      toast({
        title: "Success!",
        description: `User has been ${user ? 'updated' : 'created'} successfully.`,
      });
      onSave();
    } catch (error) {
       toast({
        title: "Error",
        description: (error as Error).message || "Something went wrong.",
        variant: "destructive"
      });
    } finally {
        setIsSaving(false);
    }
  }
  
  const isGenerating = isGeneratingImage;

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} disabled={isGenerating}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="user@example.com" {...field} disabled={!!user || isGenerating} />
                  </FormControl>
                  <FormDescription>
                    {user ? "Email cannot be changed." : "User will use this to log in."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} disabled={isGenerating}/>
                  </FormControl>
                  <FormDescription>
                    {user ? "Leave blank to keep the current password." : "Minimum 6 characters."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Picture URL</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input placeholder="https://placehold.co/40x40.png" {...field} disabled={isGenerating}/>
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
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isGenerating}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role for the user" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="instructor">Instructor</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving || isGenerating}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSaving || isGenerating}>
                    {isSaving ? 'Saving...' : 'Save User'}
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

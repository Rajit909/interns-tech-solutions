
'use client';

import { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { fetcher } from '@/lib/utils';
import type { IUser } from '@/models/User';
import { Wand2 } from 'lucide-react';
import { generateImage } from '@/ai/flows/generate-image-flow';

export default function AdminProfilePage() {
  const { toast } = useToast();
  const { data, error, isLoading } = useSWR('/api/admin/me', fetcher);
  const user: IUser | null = data?.user;

  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setImageUrl(user.imageUrl);
    }
  }, [user]);
  
  const handleGenerateImage = async () => {
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
        setImageUrl(result.imageUrl);
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


  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/users/${(user as any)._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, imageUrl }),
      });

      if (!res.ok) {
        throw new Error('Failed to update profile');
      }

      toast({ title: 'Success', description: 'Profile updated successfully.' });
      mutate('/api/admin/me'); // Revalidate user data
    } catch (error) {
      toast({ title: 'Error', description: 'Could not update profile.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Admin Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Update your account settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
             <div className="space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                </div>
             </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={isSaving || isGeneratingImage} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={user?.email || ''} disabled />
              </div>
               <div className="space-y-2">
                  <Label htmlFor="imageUrl">Profile Picture URL</Label>
                  <div className="flex items-center gap-2">
                    <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} disabled={isSaving || isGeneratingImage}/>
                    <Button type="button" variant="outline" onClick={handleGenerateImage} disabled={isSaving || isGeneratingImage}>
                        <Wand2 className="mr-2 h-4 w-4" />
                        {isGeneratingImage ? 'Generating...' : 'AI Generate'}
                    </Button>
                  </div>
                </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveChanges} disabled={isLoading || isSaving || isGeneratingImage}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Change your password here. After saving, you'll be logged out.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Change Password</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

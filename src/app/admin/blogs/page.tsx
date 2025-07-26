
'use client'

import { useState } from "react";
import useSWR, { mutate } from 'swr';
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IBlog } from "@/models/Blog";
import { useToast } from "@/hooks/use-toast";
import { fetcher } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogTable } from "@/components/admin/BlogTable";
import { BlogForm } from "@/components/admin/BlogForm";

export default function AdminBlogsPage() {
  const [editingPost, setEditingPost] = useState<IBlog | null>(null);
  const [view, setView] = useState<'table' | 'form'>('table');
  const { toast } = useToast();

  const { data, error, isLoading } = useSWR('/api/blogs?admin=true', fetcher);
  const posts: IBlog[] = data?.posts || [];

  const handleAddClick = () => {
    setEditingPost(null);
    setView('form');
  };

  const handleEditClick = (post: IBlog) => {
    setEditingPost(post);
    setView('form');
  };
  
  const handleDelete = async (postId: string) => {
    try {
      const res = await fetch(`/api/blogs/${postId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete the post.');
      }
      
      toast({ title: 'Success', description: 'Blog post deleted successfully.' });
      mutate('/api/blogs?admin=true'); // Revalidate the list
    } catch (error) {
       toast({
        title: 'Error',
        description: 'Could not delete the post.',
        variant: 'destructive',
      });
      console.error(error);
    }
  };

  const handleSave = async () => {
    setView('table');
    mutate('/api/blogs?admin=true'); // Revalidate the list
  };

  const handleCancel = () => {
    setView('table');
  };
  
  if (error) {
    toast({
        title: "Error",
        description: "Failed to load blog posts.",
        variant: "destructive"
    })
    return <div>Failed to load blog posts.</div>
  }

  return (
    <div className="space-y-6">
      {view === 'table' ? (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Manage Blog Posts</h1>
            <Button onClick={handleAddClick}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Post
            </Button>
          </div>
          {isLoading ? (
             <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
             </div>
          ) : (
            <BlogTable 
              posts={posts}
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />
          )}
        </>
      ) : (
        <>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{editingPost ? 'Edit Post' : 'Add New Post'}</h1>
            <p className="text-muted-foreground">
              {editingPost ? 'Update the details of the blog post.' : 'Fill in the details to create a new post.'}
            </p>
          </div>
          <BlogForm post={editingPost} onSave={handleSave} onCancel={handleCancel} />
        </>
      )}
    </div>
  );
}

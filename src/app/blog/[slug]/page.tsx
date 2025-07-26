
'use client';

import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Clock, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import useSWR from 'swr';
import { fetcher } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import type { IBlog } from '@/models/Blog';


export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug;
  const { data, error, isLoading } = useSWR(slug ? `/api/blogs/slug/${slug}`: null, fetcher);

  if (isLoading) {
    return (
        <article className="container mx-auto max-w-4xl py-12 px-4 space-y-8">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="aspect-video w-full" />
            <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
            </div>
        </article>
    );
  }

  if (error || !data || !data.post) {
    notFound();
  }
  
  const post: IBlog = data.post;

  // This can happen if the slug is not available yet during pre-rendering
  if (!post) {
    return null;
  }

  return (
    <article className="container mx-auto max-w-4xl py-12 px-4">
      <header className="mb-8">
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <time dateTime={new Date(post.publishDate).toISOString()}>
              {format(new Date(post.publishDate), 'MMMM d, yyyy')}
            </time>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span>{post.readTime}</span>
          </div>
        </div>
      </header>

      <div className="relative mb-8 h-auto w-full aspect-[2/1]">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="rounded-lg object-cover shadow-lg"
          data-ai-hint={post.dataAiHint || 'blog post'}
          priority
        />
      </div>

      <div
        className="prose dark:prose-invert max-w-none text-lg"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}

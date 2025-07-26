
'use client';

import { notFound, usePathname } from 'next/navigation';
import Image from 'next/image';
import { Clock, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';

// This is a temporary solution for demonstration. 
// In a real app, this data would come from a CMS or database.
const getBlogPosts = () => {
   return [
    {
      id: 'b1',
      slug: 'how-to-ace-your-technical-interview',
      title: 'How to Ace Your Technical Interview',
      excerpt: 'Discover key strategies and tips to impress in your next technical interview, from preparation to follow-up.',
      imageUrl: 'https://placehold.co/1200x600.png',
      dataAiHint: 'interview preparation',
      readTime: '7 min read',
      author: 'Jane Doe',
      date: '2024-07-20',
      content: `
        <p class="lead">Acing a technical interview requires more than just knowing how to code. It's a test of your problem-solving skills, communication, and ability to think under pressure. In this post, we'll break down the essential steps to help you prepare and shine in your next interview.</p>
        <h2 class="mt-8 mb-4 text-2xl font-bold">Preparation is Key</h2>
        <p>Start by reviewing the fundamentals of computer science: data structures (arrays, linked lists, trees, graphs, hash tables) and algorithms (sorting, searching, dynamic programming). Platforms like LeetCode and HackerRank are invaluable for practice. Don't just solve problems—understand the "why" behind the optimal solutions.</p>
        <h2 class="mt-8 mb-4 text-2xl font-bold">During the Interview</h2>
        <p>When presented with a problem, don't rush to code. First, make sure you understand the question completely. Ask clarifying questions. Verbalize your thought process as you work towards a solution. Start with a brute-force approach if needed, and then discuss how you would optimize it. This demonstrates a structured approach to problem-solving.</p>
        <h2 class="mt-8 mb-4 text-2xl font-bold">After the Interview</h2>
        <p>Always send a thank-you note within 24 hours. It's a small gesture that shows professionalism and your continued interest in the role. Reflect on the questions asked and the areas where you could improve for next time.</p>
      `
    },
    {
      id: 'b2',
      slug: 'the-future-of-remote-work-for-interns',
      title: 'The Future of Remote Work for Interns',
      excerpt: 'Explore the evolving landscape of remote internships and how you can make the most of the opportunity.',
      imageUrl: 'https://placehold.co/1200x600.png',
      dataAiHint: 'remote work',
      readTime: '5 min read',
      author: 'John Smith',
      date: '2024-07-18',
      content: `
        <p class="lead">Remote work is no longer a trend; it's a fundamental shift in how we approach careers. For interns, this opens up a world of opportunities previously limited by geography. However, it also presents unique challenges.</p>
        <h2 class="mt-8 mb-4 text-2xl font-bold">Maximizing the Experience</h2>
        <p>To succeed in a remote internship, communication is paramount. Be proactive in reaching out to your mentor and teammates. Over-communicate your progress and don't be afraid to ask questions. Schedule virtual coffee chats to build relationships you'd otherwise form in an office.</p>
        <h2 class="mt-8 mb-4 text-2xl font-bold">Staying Engaged</h2>
        <p>It's easy to feel isolated when working remotely. Actively participate in all team meetings, engage in team communication channels, and take initiative on projects. A successful remote internship can be a powerful launchpad for a flexible and global career.</p>
      `
    },
    {
      id: 'b3',
      slug: 'building-a-portfolio-that-gets-noticed',
      title: 'Building a Portfolio That Gets Noticed',
      excerpt: 'A step-by-step guide to creating a standout portfolio that showcases your skills and lands you your dream job.',
      imageUrl: 'https://placehold.co/1200x600.png',
      dataAiHint: 'design portfolio',
      readTime: '8 min read',
      author: 'Emily White',
      date: '2024-07-15',
      content: `
        <p class="lead">Your portfolio is often the first impression you make on a potential employer. It's a visual resume that needs to be compelling, well-organized, and representative of your best work.</p>
        <h2 class="mt-8 mb-4 text-2xl font-bold">What to Include</h2>
        <p>Select 3-5 of your strongest projects. For each project, don't just show the final result. Tell a story. Describe the problem, your process, the challenges you faced, and the solution you created. Include wireframes, user flows, and prototypes to showcase your thinking.</p>
        <h2 class="mt-8 mb-4 text-2xl font-bold">Design and Presentation</h2>
        <p>The design of your portfolio site itself is a project. It should be clean, easy to navigate, and mobile-friendly. Ensure your contact information is easy to find. A personal "About Me" section can also help recruiters get a sense of who you are beyond your work.</p>
      `
    },
  ];
};


export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const blogPosts = getBlogPosts();
  const post = blogPosts.find(p => p.slug === params.slug);

  if (!post) {
    notFound();
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
            <time dateTime={post.date}>
              {format(new Date(post.date), 'MMMM d, yyyy')}
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
          data-ai-hint={post.dataAiHint}
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

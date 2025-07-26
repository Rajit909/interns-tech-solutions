
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, Briefcase, Filter, Search, Building2, Rss } from 'lucide-react';
import useSWR from 'swr';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { CourseCard } from '@/components/shared/CourseCard';
import { fetcher } from '@/lib/utils';
import type { ICourse } from '@/models/Course';
import type { IInternship } from '@/models/Internship';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function FeaturedListings({ listings, isLoading, type }: { listings: (ICourse[] | IInternship[] | undefined), isLoading: boolean, type: 'Course' | 'Internship' }) {
    if (isLoading) {
        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ))}
            </div>
        )
    }

    if (!listings) {
        return <p>No {type.toLowerCase()}s found.</p>
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.slice(0, 4).map((listing) => (
                <CourseCard key={(listing as any)._id} listing={listing} />
            ))}
        </div>
    )
}


export default function Home() {
  const { data: coursesData, isLoading: coursesLoading } = useSWR('/api/courses', fetcher);
  const { data: internshipsData, isLoading: internshipsLoading } = useSWR('/api/internships', fetcher);
  
  const courses = coursesData?.courses;
  const internships = internshipsData?.internships;
  
  const partners = [
    { name: 'Innovate Inc.', logo: 'https://placehold.co/150x60.png' },
    { name: 'Data Insights Co.', logo: 'https://placehold.co/150x60.png' },
    { name: 'Creative Solutions', logo: 'https://placehold.co/150x60.png' },
    { name: 'Growth Gurus', logo: 'https://placehold.co/150x60.png' },
    { name: 'TechForward', logo: 'https://placehold.co/150x60.png' },
    { name: 'QuantumLeap', logo: 'https://placehold.co/150x60.png' },
  ];
  
   const blogPosts = [
    {
      id: 'b1',
      title: 'How to Ace Your Technical Interview',
      excerpt: 'Discover key strategies and tips to impress in your next technical interview, from preparation to follow-up.',
      imageUrl: 'https://placehold.co/600x400.png',
      dataAiHint: 'interview preparation'
    },
    {
      id: 'b2',
      title: 'The Future of Remote Work for Interns',
      excerpt: 'Explore the evolving landscape of remote internships and how you can make the most of the opportunity.',
      imageUrl: 'https://placehold.co/600x400.png',
      dataAiHint: 'remote work'
    },
    {
      id: 'b3',
      title: 'Building a Portfolio That Gets Noticed',
      excerpt: 'A step-by-step guide to creating a standout portfolio that showcases your skills and lands you your dream job.',
      imageUrl: 'https://placehold.co/600x400.png',
      dataAiHint: 'design portfolio'
    },
  ];


  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="relative w-full bg-secondary/30 py-20 md:py-32 lg:py-40">
          <div className="container mx-auto px-4 text-center md:px-6">
            <div className="space-y-6">
              <h1 className="font-headline text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                Find Your Future. <span className="text-primary">Today.</span>
              </h1>
              <p className="mx-auto max-w-3xl text-lg text-muted-foreground md:text-xl">
                Intern Tech Solutions is your gateway to top-tier online courses and
                exclusive internships. Start your journey with us and unlock
                your potential.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <a href="#courses">
                    Explore Courses <ArrowRight className="ml-2" />
                  </a>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <a href="#internships">Find Internships</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="-mt-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center gap-4 rounded-lg border bg-card p-4 shadow-lg md:flex-row">
              <div className="relative w-full flex-grow">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by keyword..."
                  className="h-12 pl-10 text-base"
                />
              </div>
              <Select>
                <SelectTrigger className="h-12 w-full text-base md:w-[200px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web-dev">Web Development</SelectItem>
                  <SelectItem value="data-science">Data Science</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
              <Button size="lg" className="h-12 w-full md:w-auto">
                <Filter className="mr-2 h-5 w-5" />
                Filter
              </Button>
            </div>
          </div>
        </section>

        <section id="courses" className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-8 flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary" />
              <h2 className="font-headline text-3xl font-bold tracking-tight">
                Featured Courses
              </h2>
            </div>
            <FeaturedListings listings={courses} isLoading={coursesLoading} type="Course" />
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg" asChild>
                <Link href="/dashboard/courses">View All Courses <ArrowRight className="ml-2" /></Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="internships" className="bg-secondary/30 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-8 flex items-center gap-3">
              <Briefcase className="h-8 w-8 text-primary" />
              <h2 className="font-headline text-3xl font-bold tracking-tight">
                Latest Internships
              </h2>
            </div>
            <FeaturedListings listings={internships} isLoading={internshipsLoading} type="Internship" />
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg" asChild>
                <Link href="/dashboard/internships">View All Internships <ArrowRight className="ml-2" /></Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="about" className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div>
                <h2 className="font-headline text-3xl font-bold tracking-tight">
                  Why Intern Tech Solutions?
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  We bridge the gap between education and industry. Our platform
                  is meticulously designed to provide students with skills that
                  matter and opportunities that launch careers. With expert-led
                  courses and partnerships with leading companies, Intern Tech Solutions is more than a platform—it&apos;s your career
                  partner.
                </p>
                <ul className="mt-6 space-y-4">
                  {[
                    {
                      icon: BookOpen,
                      title: 'Industry-Relevant Courses',
                      desc: 'Curriculum designed with experts to meet market demands.',
                    },
                    {
                      icon: Briefcase,
                      title: 'Exclusive Internships',
                      desc: 'Access opportunities at top companies and startups.',
                    },
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mr-4 flex-shrink-0 rounded-full bg-primary/10 p-2 text-primary">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-muted-foreground">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative h-80 w-full lg:h-96">
                <Image
                  src="https://placehold.co/600x400.png"
                  alt="About Us Image"
                  fill
                  className="rounded-lg object-cover shadow-lg"
                  data-ai-hint="team collaboration"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="partners" className="bg-secondary/30 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12 text-center">
                <div className="mb-4 inline-flex items-center gap-3">
                    <Building2 className="h-8 w-8 text-primary" />
                    <h2 className="font-headline text-3xl font-bold tracking-tight">
                        Our Hiring Partners
                    </h2>
                </div>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                    We partner with leading companies to provide exclusive opportunities for our students.
                </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {partners.map((partner) => (
                <div key={partner.name} className="grayscale transition-all hover:grayscale-0">
                  <Image
                    src={partner.logo}
                    alt={`${partner.name} Logo`}
                    width={150}
                    height={60}
                    className="object-contain"
                    data-ai-hint="company logo"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="blog" className="py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                 <div className="mb-12 text-center">
                    <div className="mb-4 inline-flex items-center gap-3">
                        <Rss className="h-8 w-8 text-primary" />
                        <h2 className="font-headline text-3xl font-bold tracking-tight">
                            From Our Blog
                        </h2>
                    </div>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        Stay updated with the latest industry trends, career advice, and platform news.
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {blogPosts.map((post) => (
                        <Card key={post.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                            <CardHeader className="p-0">
                                <Link href="#" className="block">
                                    <Image
                                        src={post.imageUrl}
                                        alt={post.title}
                                        width={600}
                                        height={400}
                                        className="w-full object-cover"
                                        data-ai-hint={post.dataAiHint}
                                    />
                                </Link>
                            </CardHeader>
                            <CardContent className="p-6">
                                <CardTitle className="mb-2 text-xl font-bold leading-tight">
                                    <Link href="#" className="hover:text-primary">{post.title}</Link>
                                </CardTitle>
                                <p className="text-muted-foreground">{post.excerpt}</p>
                            </CardContent>
                            <div className="p-6 pt-0">
                                <Button asChild variant="link" className="p-0">
                                    <Link href="#">Read More <ArrowRight className="ml-1 h-4 w-4"/></Link>
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

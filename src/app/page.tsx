import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, Briefcase, Filter, Search } from 'lucide-react';

import { listings } from '@/lib/mockData';
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

export default function Home() {
  const courses = listings.filter((l) => l.type === 'Course');
  const internships = listings.filter((l) => l.type === 'Internship');

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
                Nexus Learning is your gateway to top-tier online courses and
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {courses.slice(0, 4).map((listing) => (
                <CourseCard key={listing.id} listing={listing} />
              ))}
            </div>
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {internships.slice(0, 4).map((listing) => (
                <CourseCard key={listing.id} listing={listing} />
              ))}
            </div>
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
                  Why Nexus Learning?
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  We bridge the gap between education and industry. Our platform
                  is meticulously designed to provide students with skills that
                  matter and opportunities that launch careers. With expert-led
                  courses and partnerships with leading companies, Nexus
                  Learning is more than a platform—it&apos;s your career
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
                  src="https://placehold.co/600x400"
                  alt="About Us Image"
                  fill
                  className="rounded-lg object-cover shadow-lg"
                  data-ai-hint="team collaboration"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

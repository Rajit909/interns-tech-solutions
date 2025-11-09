

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, Briefcase, Filter, Search, Building2, Rss, Clock, HelpCircle, GraduationCap, PenSquare, Quote } from 'lucide-react';
import { unstable_noStore as noStore } from 'next/cache';

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
import type { ICourse } from '@/models/Course';
import type { IInternship } from '@/models/Internship';
import type { IBlog } from '@/models/Blog';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import connectDB from '@/lib/db';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import type { IQuiz } from '@/models/Quiz';
import { RecentQuiz } from '@/components/home/RecentQuiz';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


async function getCourses() {
    noStore();
    await connectDB();
    const Course = require('@/models/Course').default;
    const courses = await Course.find({}).sort({ studentsEnrolled: -1 }).limit(4).lean();
    return JSON.parse(JSON.stringify(courses)) as ICourse[];
}

async function getInternships() {
    noStore();
    await connectDB();
    const Internship = require('@/models/Internship').default;
    const internships = await Internship.find({}).sort({ applicants: -1 }).limit(4).lean();
    return JSON.parse(JSON.stringify(internships)) as IInternship[];
}

async function getBlogPosts() {
    noStore();
    await connectDB();
    const Blog = require('@/models/Blog').default;
    const posts = await Blog.find({ status: 'published', publishDate: { $lte: new Date() } }).sort({ publishDate: -1 }).limit(3).lean();
    return JSON.parse(JSON.stringify(posts)) as IBlog[];
}

async function getRecentQuiz() {
    noStore();
    await connectDB();
    const { Quiz } = require('@/models/Quiz');
    const quiz = await Quiz.findOne({}).sort({ createdAt: -1 }).populate('questions').lean();
    return JSON.parse(JSON.stringify(quiz)) as IQuiz;
}


function FeaturedListings({ listings, type }: { listings: (ICourse[] | IInternship[]), type: 'Course' | 'Internship' }) {

    if (!listings || listings.length === 0) {
        return <p>No {type.toLowerCase()}s found.</p>
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((listing) => (
                <CourseCard key={(listing as any)._id} listing={listing} />
            ))}
        </div>
    )
}

function FeaturedBlogPosts({ posts }: { posts: IBlog[] }) {
    if (!posts || posts.length === 0) {
        return <p>Could not load blog posts.</p>
    }

    return (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
                <Card key={(post as any)._id} className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
                    <CardHeader className="p-0">
                        <Link href={`/blog/${post.slug}`} className="block">
                            <Image
                                src={post.imageUrl}
                                alt={post.title}
                                width={600}
                                height={400}
                                className="w-full object-cover aspect-[3/2]"
                                data-ai-hint={post.dataAiHint || 'blog post'}
                            />
                        </Link>
                    </CardHeader>
                    <CardContent className="flex-grow p-6">
                        <CardTitle className="mb-2 text-xl font-bold leading-tight">
                            <Link href={`/blog/${post.slug}`} className="hover:text-primary">{post.title}</Link>

                        </CardTitle>
                        <p className="text-muted-foreground line-clamp-3">{post.excerpt || ''}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center p-6 pt-0 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{post.readTime}</span>
                        </div>
                        <Button asChild variant="link" className="p-0">
                            <Link href={`/blog/${post.slug}`}>Read More <ArrowRight className="ml-1 h-4 w-4"/></Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}


export default async function Home() {
  const courses = await getCourses();
  const internships = await getInternships();
  const posts = await getBlogPosts();
  const recentQuiz = await getRecentQuiz();
  
  const partners = [
    { name: 'Innovate Inc.', logo: 'https://placehold.co/150x60.png' },
    { name: 'Data Insights Co.', logo: 'https://placehold.co/150x60.png' },
    { name: 'Creative Solutions', logo: 'https://placehold.co/150x60.png' },
    { name: 'Growth Gurus', logo: 'https://placehold.co/150x60.png' },
    { name: 'TechForward', logo: 'https://placehold.co/150x60.png' },
    { name: 'QuantumLeap', logo: 'https://placehold.co/150x60.png' },
  ];

  const howItWorksSteps = [
    {
      icon: Search,
      title: 'Explore Opportunities',
      description: 'Browse our extensive catalog of industry-vetted courses and exclusive internship positions.',
    },
    {
      icon: PenSquare,
      title: 'Enroll & Learn',
      description: 'Enroll in courses with a single click and start learning from experts at your own pace.',
    },
    {
      icon: Briefcase,
      title: 'Apply & Get Hired',
      description: 'Apply for internships that match your skills and get your foot in the door at top companies.',
    },
    {
      icon: GraduationCap,
      title: 'Launch Your Career',
      description: 'Combine your new skills and experience to launch a successful career in the tech industry.',
    },
  ];

  const testimonials = [
    {
        quote: "This platform was a game-changer for my career transition. The courses are top-notch and the internship I landed through them was invaluable.",
        name: "Sarah L.",
        role: "Software Engineer at TechForward",
        avatar: "https://i.pravatar.cc/150?u=sarah"
    },
    {
        quote: "I always struggled with interviews, but the 'Ace the Interview' course gave me the confidence and skills I needed. Highly recommended!",
        name: "Michael B.",
        role: "Frontend Developer at Innovate Inc.",
        avatar: "https://i.pravatar.cc/150?u=michael"
    },
    {
        quote: "As a student, finding relevant experience is tough. Intern Tech Solutions connected me with opportunities I wouldn't have found otherwise.",
        name: "Jessica P.",
        role: "Data Science Intern at Data Insights",
        avatar: "https://i.pravatar.cc/150?u=jessica"
    }
];
  

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroCarousel />
        
        <section className="-mt-12 z-10 relative">
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
            <FeaturedListings listings={courses} type="Course" />
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
            <FeaturedListings listings={internships} type="Internship" />
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg" asChild>
                <Link href="/dashboard/internships">View All Internships <ArrowRight className="ml-2" /></Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mb-12 text-center">
                    <h2 className="font-headline text-3xl font-bold tracking-tight">How It Works</h2>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">Four simple steps to launch your career.</p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {howItWorksSteps.map((step, index) => (
                        <div key={index} className="text-center">
                            <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-4 text-primary">
                                <step.icon className="h-8 w-8" />
                            </div>
                            <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
        
        {recentQuiz && (
            <section id="quiz" className="bg-secondary/30 py-16 md:py-24">
                 <div className="container mx-auto px-4 md:px-6">
                     <div className="mb-12 text-center">
                        <div className="mb-4 inline-flex items-center gap-3">
                            <HelpCircle className="h-8 w-8 text-primary" />
                            <h2 className="font-headline text-3xl font-bold tracking-tight">
                                Test Your Knowledge
                            </h2>
                        </div>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                            Take our latest quiz to challenge yourself and reinforce your learning.
                        </p>
                    </div>
                    <RecentQuiz quiz={recentQuiz} />
                </div>
            </section>
        )}

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

        <section id="testimonials" className="py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mb-12 text-center">
                    <div className="mb-4 inline-flex items-center gap-3">
                        <Quote className="h-8 w-8 text-primary" />
                        <h2 className="font-headline text-3xl font-bold tracking-tight">
                            What Our Students Say
                        </h2>
                    </div>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        Hear from students who have launched their careers with us.
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                       <Card key={index} className="flex flex-col">
                           <CardContent className="flex-grow p-6 flex flex-col justify-center items-center text-center">
                               <Quote className="h-8 w-8 text-muted-foreground/50 mb-4" />
                               <p className="italic text-muted-foreground mb-6">&quot;{testimonial.quote}&quot;</p>
                           </CardContent>
                           <CardFooter className="flex flex-col items-center justify-center p-6 border-t">
                               <Avatar className="mb-2">
                                   <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                                   <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                               </Avatar>
                               <div className="font-bold">{testimonial.name}</div>
                               <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                           </CardFooter>
                       </Card>
                    ))}
                </div>
            </div>
        </section>


        <section id="blog" className="bg-secondary/30 py-16 md:py-24">
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
                <FeaturedBlogPosts posts={posts} />
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

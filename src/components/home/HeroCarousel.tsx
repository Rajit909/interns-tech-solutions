
'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Autoplay from 'embla-carousel-autoplay';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const slides = [
  {
    title: 'Find Your Future. Today.',
    description: 'Our platform is your gateway to top-tier online courses and exclusive internships. Start your journey with us and unlock your full potential.',
    buttonText: 'Explore Courses',
    buttonLink: '#courses',
    imageUrl: 'https://placehold.co/1920x800.png',
    dataAiHint: 'students learning'
  },
  {
    title: 'Land Your Dream Internship.',
    description: 'Gain real-world experience with internships at leading tech companies and innovative startups. Your career starts here.',
    buttonText: 'Find Internships',
    buttonLink: '#internships',
    imageUrl: 'https://placehold.co/1920x800.png',
    dataAiHint: 'modern office'
  },
  {
    title: 'Master In-Demand Skills.',
    description: 'From web development to data science, our expert-led courses are designed to give you the competitive edge in today\'s job market.',
    buttonText: 'Browse Catalog',
    buttonLink: '/dashboard/courses',
    imageUrl: 'https://placehold.co/1920x800.png',
    dataAiHint: 'woman coding'
  },
];

export function HeroCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <section>
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[500px] w-full md:h-[600px] lg:h-[700px]">
                <Image
                  src={slide.imageUrl}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  data-ai-hint={slide.dataAiHint}
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="container mx-auto px-4 text-center text-white md:px-6">
                    <div className="max-w-4xl mx-auto space-y-6">
                      <h1 className="font-headline text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                        {slide.title}
                      </h1>
                      <p className="mx-auto max-w-3xl text-lg text-white/90 md:text-xl">
                        {slide.description}
                      </p>
                      <Button size="lg" asChild>
                        <Link href={slide.buttonLink}>
                          {slide.buttonText} <ArrowRight className="ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/20 hover:bg-black/50 border-none h-12 w-12 hidden md:flex" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/20 hover:bg-black/50 border-none h-12 w-12 hidden md:flex" />
      </Carousel>
    </section>
  );
}

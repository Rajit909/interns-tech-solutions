
'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Autoplay from 'embla-carousel-autoplay';
import useSWR from 'swr';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { fetcher } from '@/lib/utils';
import type { IHeroSlide } from '@/models/HeroSlide';
import { Skeleton } from '@/components/ui/skeleton';


export function HeroCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );
  
  const { data, error, isLoading } = useSWR('/api/heroslides', fetcher);
  const slides: IHeroSlide[] = data?.slides || [];

  if (isLoading) {
    return (
        <section>
            <div className="relative h-[500px] w-full md:h-[600px] lg:h-[700px]">
                <Skeleton className="h-full w-full" />
                 <div className="absolute inset-0 flex items-center justify-center">
                  <div className="container mx-auto px-4 text-center text-white md:px-6">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <Skeleton className="h-16 w-3/4 mx-auto" />
                        <Skeleton className="h-6 w-full max-w-lg mx-auto" />
                         <Skeleton className="h-12 w-48 mx-auto" />
                    </div>
                  </div>
                </div>
            </div>
        </section>
    )
  }
  
  if (error || !slides.length) {
    return (
        <section>
             <div className="relative h-[500px] w-full md:h-[600px] lg:h-[700px] bg-secondary">
                 <div className="absolute inset-0 flex items-center justify-center">
                  <div className="container mx-auto px-4 text-center md:px-6">
                     <p>Could not load slides.</p>
                  </div>
                </div>
            </div>
        </section>
    )
  }


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
            <CarouselItem key={(slide as any)._id}>
              <div className="relative h-[500px] w-full md:h-[600px] lg:h-[700px]">
                <Image
                  src={slide.imageUrl}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  data-ai-hint={slide.dataAiHint || 'website hero'}
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

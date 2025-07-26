'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/recommend-courses.ts';
import '@/ai/flows/generate-image-flow.ts';
import '@/ai/flows/generate-description-flow.ts';
import '@/ai/flows/suggest-course-details-flow.ts';
import '@/ai/flows/suggest-internship-details-flow.ts';
import '@/ai/flows/suggest-blog-details-flow.ts';

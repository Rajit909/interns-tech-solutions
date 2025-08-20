
import mongoose, { Schema, Document, models } from 'mongoose';

export interface ILesson {
  _id: string;
  title: string;
  type: 'video' | 'text';
  content: string; // URL for video, or markdown text
  duration: number; // in minutes
}

export interface IModule {
  _id: string;
  title: string;
  lessons: ILesson[];
}

export interface ICourse extends Document {
  title: string;
  category: string;
  instructor: string;
  description: string;
  duration: string;
  price: number;
  rating: number;
  imageUrl: string;
  type: 'Course';
  studentsEnrolled: number;
  modules: IModule[];
}

const LessonSchema: Schema = new Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['video', 'text'], default: 'video' },
  content: { type: String, required: true, default: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  duration: { type: Number, required: true, default: 5 },
});

const ModuleSchema: Schema = new Schema({
  title: { type: String, required: true },
  lessons: [LessonSchema],
});


const CourseSchema: Schema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  instructor: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  type: { type: String, required: true, default: 'Course' },
  studentsEnrolled: { type: Number, required: true },
  modules: [ModuleSchema],
});

export default models.Course || mongoose.model<ICourse>('Course', CourseSchema);

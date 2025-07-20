import mongoose, { Schema, Document, models } from 'mongoose';

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
}

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
});

export default models.Course || mongoose.model<ICourse>('Course', CourseSchema);

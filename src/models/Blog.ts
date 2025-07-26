
import mongoose, { Schema, Document, models } from 'mongoose';

export interface IBlog extends Document {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  dataAiHint?: string;
  author: string;
  date: string;
  readTime: string;
}

const BlogSchema: Schema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, required: true },
  dataAiHint: { type: String },
  author: { type: String, required: true },
  date: { type: String, required: true },
  readTime: { type: String, required: true },
});

export default models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);

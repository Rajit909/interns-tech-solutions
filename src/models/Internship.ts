import mongoose, { Schema, Document, models } from 'mongoose';

export interface IInternship extends Document {
  title: string;
  category: string;
  organization: string;
  description: string;
  duration: string;
  stipend: string;
  location: string;
  imageUrl: string;
  type: 'Internship';
  applicants: number;
}

const InternshipSchema: Schema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  organization: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  stipend: { type: String, required: true },
  location: { type: String, required: true },
  imageUrl: { type: String, required: true },
  type: { type: String, required: true, default: 'Internship' },
  applicants: { type: Number, required: true },
});

export default models.Internship || mongoose.model<IInternship>('Internship', InternshipSchema);

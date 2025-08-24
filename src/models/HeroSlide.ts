
import mongoose, { Schema, Document, models } from 'mongoose';

export interface IHeroSlide extends Document {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  dataAiHint?: string;
  buttonText: string;
  buttonLink: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const HeroSlideSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  dataAiHint: { type: String },
  buttonText: { type: String, required: true },
  buttonLink: { type: String, required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default models.HeroSlide || mongoose.model<IHeroSlide>('HeroSlide', HeroSlideSchema);

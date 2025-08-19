
import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IQuestion extends Document {
  text: string;
  options: string[];
  correctAnswer: number;
}

const QuestionSchema: Schema = new Schema({
  text: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: Number, required: true },
});

export interface IQuiz extends Document {
  _id: string;
  title: string;
  description: string;
  course: Schema.Types.ObjectId;
  questions: IQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const QuizSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course' },
  questions: [QuestionSchema],
}, { timestamps: true });

export const Quiz: Model<IQuiz> = models.Quiz || mongoose.model<IQuiz>('Quiz', QuizSchema);
export const Question: Model<IQuestion> = models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);

    
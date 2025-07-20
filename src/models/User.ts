import mongoose, { Schema, Document, models } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  role: 'student' | 'admin';
  status: 'active' | 'blocked';
  subscription: 'free' | 'premium' | 'none';
  joinedDate: string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  status: { type: String, enum: ['active', 'blocked'], default: 'active' },
  subscription: { type: String, enum: ['free', 'premium', 'none'], default: 'none' },
  joinedDate: { type: String, required: true },
});

export default models.User || mongoose.model<IUser>('User', UserSchema);

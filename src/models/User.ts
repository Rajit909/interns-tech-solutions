import mongoose, { Schema, Document, models } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Optional for safety when sending user object to client
  role: 'student' | 'admin';
  status: 'active' | 'blocked';
  subscription: 'free' | 'premium' | 'none';
  joinedDate: string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // Default to not select password
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  status: { type: String, enum: ['active', 'blocked'], default: 'active' },
  subscription: { type: String, enum: ['free', 'premium', 'none'], default: 'none' },
  joinedDate: { type: String, required: true },
});

// This hook is not needed for signup, but it is for login.
// It ensures that when you find a user by email, the password field is included.
UserSchema.pre('findOne', function (next) {
  const query = this.getQuery();
  if (query.email) {
    // @ts-ignore
    this.select('+password');
  }
  next();
});

export default models.User || mongoose.model<IUser>('User', UserSchema);
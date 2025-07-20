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

// Re-add select for password when needed, e.g., for login check
UserSchema.pre('findOne', function (next) {
    const { email } = this.getQuery();
    if (email) {
        // @ts-ignore
        this.select('+password');
    }
    next();
});


export default models.User || mongoose.model<IUser>('User', UserSchema);

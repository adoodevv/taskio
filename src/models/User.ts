import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
   name: string;
   email: string;
   password: string;
   role: 'seeker' | 'taskio';
   profilePicture?: string;
   headerImage?: string;
   createdAt: Date;
   updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
   {
      name: {
         type: String,
         required: [true, 'Name is required'],
         trim: true,
         maxlength: [50, 'Name cannot be more than 50 characters'],
      },
      email: {
         type: String,
         required: [true, 'Email is required'],
         unique: true,
         lowercase: true,
         trim: true,
         match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
      },
      password: {
         type: String,
         required: [true, 'Password is required'],
         minlength: [6, 'Password must be at least 6 characters'],
      },
      role: {
         type: String,
         enum: ['seeker', 'taskio'],
         default: 'seeker',
      },
      profilePicture: {
         type: String,
         default: null,
      },
      headerImage: {
         type: String,
         default: null,
      },
   },
   {
      timestamps: true,
   }
);

// Prevent mongoose from creating the model multiple times
export default mongoose.models.User || mongoose.model<IUser>('User', userSchema); 
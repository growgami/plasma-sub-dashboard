import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  referralCode: {
    type: String,
    required: true,
    unique: true
  },
  referredBy: {
    type: String,
    default: null
  },
  referralCount: {
    type: Number,
    default: 0
  },
  linkVisits: {
    type: Number,
    default: 0
  },
  position: {
    type: Number,
    required: true
  },
  maxTarget: {
    type: Number,
    required: true
  },
  apiKey: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'users'
});

export interface IUser extends mongoose.Document {
  email: string;
  referralCode: string;
  referredBy: string | null;
  referralCount: number;
  linkVisits: number;
  position: number;
  maxTarget: number;
  apiKey: string;
  createdAt: Date;
}

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema); 
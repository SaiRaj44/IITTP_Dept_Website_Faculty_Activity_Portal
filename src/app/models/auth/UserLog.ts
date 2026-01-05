import mongoose from 'mongoose';

export interface IUserLog {
  userId: string;
  name: string;
  email: string;
  loginMethod: 'google' | 'credentials';
  loginTimestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

const UserLogSchema = new mongoose.Schema<IUserLog>({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  loginMethod: { type: String, enum: ['google', 'credentials'], required: true },
  loginTimestamp: { type: Date, default: Date.now },
  ipAddress: { type: String },
  userAgent: { type: String }
});

export default mongoose.models.UserLog || mongoose.model<IUserLog>('UserLog', UserLogSchema);

import mongoose, { Schema} from 'mongoose';
import { IUser } from '../types/user.type';

const UserSchema: Schema = new Schema ({
    username: { type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    achievements: { type: String },
    badges: [{ type: [String], default: [] }],
    streak: { type: [Number], default: [] },
    },
    
    { timestamps: true },
)

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
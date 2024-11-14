import mongoose, { Schema} from 'mongoose';
import { IUser } from '../utils/user.utils';

const UserSchema: Schema = new Schema ({
    username: { type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    achievements: [{ type: String }],
    streaks: { type: Number, default: 0 },
    },
    
    { timestamps: true },
)

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
import { Schema, Types, model} from 'mongoose';
import { IStreak } from '../types/streak.types';

const streakSchema = new Schema<IStreak>({

    user: { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    type: { 
        type: String, 
        required: true 
    },
    count: { 
        type: Number, 
        default: 0 
    },
    lastLoggedDate: { 
        type: Date, 
        default: null 
    },
  },
  {
    timestamps: true,
}
);

const Streak = model<IStreak>("Streak", streakSchema);

export default Streak;
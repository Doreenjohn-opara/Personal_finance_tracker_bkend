import { Schema, Types, model} from 'mongoose';
import { IBadge } from '../types/badges.types';

const badgeSchema = new Schema<IBadge> ({
    user: {
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true
    },
    name: { 
      type: String, 
      required: true 
    },
    description: { 
    type: String, 
    required: true 
  },
    condition: { 
    type: String, 
    required: true 
  },
    tier: { 
    type: String, 
    enum: ["bronze", "silver", "gold"], 
    required: true 
  },
}, 
{
  timestamps: true,
}
);

const Badge = model<IBadge>('Badge', badgeSchema);

export default Badge;
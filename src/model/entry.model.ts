import { Schema, Types, model} from 'mongoose';
import { IEntry } from '../utils/entry.utils';

const entrySchema = new Schema<IEntry>(
    {
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },

    date: { 
        type: Date, 
        required: true 
    },

    amount: { 
        type: Number, 
        required: true 
    },

    category: { 
        type: String, 
        required: true 
    },

    type: { 
        type: String, 
        enum: ["income", "expense"], 
        required: true 
    },
    
    description: { 
        type: String 
    },
  },
  {
    timestamps: true,
  }
);

const Entry = model<IEntry>("Entry", entrySchema);

export default Entry;
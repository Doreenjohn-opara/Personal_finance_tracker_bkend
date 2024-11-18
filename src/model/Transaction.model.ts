import { Schema, Types, model} from 'mongoose';
import { IEntry } from '../types/transaction.type';

const entrySchema = new Schema<IEntry>(
    {
    user: { 
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
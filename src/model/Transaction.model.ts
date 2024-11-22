import { Schema, Types, model} from 'mongoose';
import { ITransaction } from '../types/transaction.type';

const transactionSchema = new Schema<ITransaction>(
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

const Transaction = model<ITransaction>("Entry", transactionSchema);

export default Transaction;
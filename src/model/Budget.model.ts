import { Schema, Types, model} from 'mongoose';
import { IBudget } from '../types/budget.types';

const budgetSchema = new Schema<IBudget> (
    {
    user: { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },

    name: {
        type: String,
        required: true
        },

    amount: {
        type: Number,
        required: true
    },

    category: {
        type: String,
    },

    startDate: {
        type: Date,
        required: true
        },

    endDate: {
        type: Date,
        required: true
    }
},
    {
        timestamps: true,
    }
)

const Budget = model<IBudget>("Budget", budgetSchema);

export default Budget;
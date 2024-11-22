import { Types } from "mongoose";

export interface IBudget {
    user: Types.ObjectId;
    name: string;
    amount: number;
    category: string;
    startDate: Date;
    endDate: Date;
} 
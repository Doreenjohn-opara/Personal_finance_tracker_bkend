import { Types } from "mongoose";

export interface ITransaction {
    user: Types.ObjectId;
    date: Date;
    amount: number;
    category: string;
    type: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
  }
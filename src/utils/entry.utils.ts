import { Types } from "mongoose";

export interface IEntry {
    userId: Types.ObjectId;
    date: Date;
    amount: number;
    category: string;
    type: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
  }
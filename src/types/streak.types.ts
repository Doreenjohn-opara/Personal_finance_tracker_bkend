import { Types } from "mongoose";

export interface IStreak {
    user: Types.ObjectId;
    type: string;
    count: number;
    lastLoggedDate: Date;
}


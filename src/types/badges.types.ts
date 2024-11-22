import {Types} from 'mongoose';

export interface IBadge {
        user: Types.ObjectId;
        name: string;
        description: string;
        condition: string; // e.g., "logExpensesDailyFor7Days"
        tier: "bronze" | "silver" | "gold";
}

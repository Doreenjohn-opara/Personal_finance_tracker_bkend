export interface IUser {
    username: string,
    email: string,
    password: string,
    achievements?: string,
    badges?: string[];
    streak?: {
        type: string;
        count: number;
        lastLoggedDate: Date;
    }[];
}
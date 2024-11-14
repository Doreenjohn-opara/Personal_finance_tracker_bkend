export interface IUser {
    username: string,
    email: string,
    password: string,
    achievements?: string[];
    streaks?: number;
}
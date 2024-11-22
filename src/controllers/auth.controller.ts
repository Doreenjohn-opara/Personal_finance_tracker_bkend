import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../utils/error.utils";
import User from '../model/User.model';
import { IUser } from "../types/user.type";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({ username, email, password: hashedPassword });

        if (!user) {
            return next(new ErrorResponse('Error', 400, ["Invalid user data"]));
        }
        
        await user.save();
        res.status(201).json({ error: false, data: null, message: 'User registered successfully!' });
    } catch (error) {
        if (error instanceof Error) {
            return next(new ErrorResponse('Error', 400, ["Internal server error: " + error.message ]));
        } else {
            return next(new ErrorResponse('Error', 400, ["An unknown error occurred."]));
        }
    }
}

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return next(new ErrorResponse('Error', 400, ["Please Provide email or password"]));
        };

        if (!password) {
            return next(new ErrorResponse('Error', 400, ["Invalid"]));
        };

        const user = await User.findOne({ email });
        if(!user) {
            return next(new ErrorResponse('Error', 400, ["User not found"]));
        }

        const comparePassword = bcrypt.compare(password, user.password);
        if (!comparePassword){
            return next(new ErrorResponse('Error', 400, ["Invalid"]));
        }

        try {
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET as string, {expiresIn: '1hr'});
            res.status(200).json({error: false, data: token, message: 'Login Successful'})
            return;
        } catch (error) {
            return next(new ErrorResponse('Error', 500, ["Token generation failed"]));
        }
    } catch (error: any) {
        return next(new ErrorResponse('Error', 500, [error.message]));
    }
}
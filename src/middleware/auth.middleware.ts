import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


const protect = async (req: Request, res: Response, next: NextFunction ) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: true, data: null, message: 'Authorization token is missing'});
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {id: string};
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({error: true, data: null, message: 'Unauthorized'})
        return;
    }
}

export default protect;
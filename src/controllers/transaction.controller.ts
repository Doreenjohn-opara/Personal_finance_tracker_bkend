import { RequestHandler, Request, Response, NextFunction } from "express";
import Entry from "../model/Transaction.model";
import ErrorResponse from "../utils/error.utils";
import moment from 'moment'; 

// Predefined categories
const predefinedCategories = ["Salary", "Groceries", "Entertainment", "Utilities", "Transportation", "Rent"];

// create new entry
export const createTransaction = async (req: Request, res: Response, next: NextFunction ) => {
    try {
        const { date, amount, category, type: rawType, description } = req.body;

        // Check for userId
        const userId = (req as any).user.id;
        if (!userId) {
            return next(new ErrorResponse('Error', 401, ["Unauthorized access"]));
        }

        // Ensure type is valid
        const type = rawType?.toLowerCase();
        if (!['income', 'expense'].includes(type)) {
        return next(new ErrorResponse('Error', 400, ["Invalid type value."]));
        }

        // Create and save the entry
        const entry = new Entry({ user: userId, date, amount, category, type, description });
        await entry.save();
        
        res.status(201).json({error: false, data: entry, message: "Transaction saved successfully"});

    } catch (error: any) {
        return next(new ErrorResponse('Error', 500, ["Error creating entries: " + error.message]));
    }
}

// Get all entries
export const getAllTransactions = async (req: Request, res: Response, next: NextFunction) => {
    // let result = { error: false, message:'', code: 200, data:null }

    try {
        const userId = req.user.id;

        if (!userId) {
        return next(new ErrorResponse('Error', 500, ["Unauthorized access"]));
        }

        const entries: any = await Entry.find({user: userId}).sort({createdAt: - 1});

        // Check if no entries are found
        if (entries.length === 0) {
             res.status(200).json({
                error: false,
                message: "No entries found for this user.",
                data: [],
            });

            // result.error = false;
            // result.message = '....'
            return;
        }
        res.status(200).json({error: false, data: entries, message: "Transactions retrieved Successfully"});
        return;
    } catch (error: any) {
        return next(new ErrorResponse('Error', 500, ["Error fetching entries: " + error.message]));
    }
    
};

// Get a single entry by ID
export const getTransactionById = async (req: Request, res: Response, next: NextFunction) => {
    
        try {
            const { id } = req.params;
            const entry: any = await Entry.findById(id);
            const userId = req.user.id;
        
            if (!entry || (entry.user.toString() !== userId)) {
                return next(new ErrorResponse('Error', 401, ["Entry not found"]))
            };

          res.status(200).json({error: false, data: entry, message: "Transaction retrieved successfully"});
          return;
    } catch (error: any) {
        return next(new ErrorResponse('Error', 500, ["Error fetching entry: " + error.message]));
    }
};

// Updating entry by ID
export const updateTransaction = async (req: Request, res: Response) => {
    try {
        const { date, amount, category, type, description } = req.body;
        const userId = req.user.id;
        const entry: any = await Entry.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!entry || (entry.user.toString() !== userId)) {
            res.status(401).json({ error: true, data: null, message: "Entry not found" });
            return;
        }
        res.status(200).json({error: false, data: entry, message: "Transaction updated successfully"});
        return; 
    } catch (error: any) {
        res.status(500).json({ error: true, data: null, "Error updating note": error.message });
        return; 
    };
};

// Deleting entries by ID
export const deleteTransaction = async (req: Request, res: Response) => {
    try {
        const entry = await Entry.findByIdAndDelete(req.params.id);
        if (!entry || (entry.user.toString() !== req.user.id)) {
            res.status(401).json({ error: true, data: null, message: "Entry not found or not authorized" });
            return;
          }
          res.status(200).json({ error: true, data: null, message: "Entry deleted successfully" });
          return; 
    } catch (error) {
        res.status(500).json({ error: true, data: null, "Error deleting note": error });
        return;
    }
}



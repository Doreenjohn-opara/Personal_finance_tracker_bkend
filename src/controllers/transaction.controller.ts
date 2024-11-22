import { RequestHandler, Request, Response, NextFunction } from "express";
import Transaction from "../model/Transaction.model";
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
        const transaction = new Transaction({ user: userId, date, amount, category, type, description });
        await transaction.save();
        
        res.status(201).json({error: false, data: transaction, message: "Transaction saved successfully"});

    } catch (error: any) {
        return next(new ErrorResponse('Error', 500, ["Error creating transactions: " + error.message]));
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

        const transactions: any = await Transaction.find({user: userId}).sort({createdAt: - 1});

        // Check if no entries are found
        if (transactions.length === 0) {
             res.status(200).json({
                error: false,
                message: "No transactions found for this user",
                data: [],
            });

            // result.error = false;
            // result.message = '....'
            return;
        }
        res.status(200).json({error: false, data: transactions, message: "Transactions retrieved Successfully"});
        return;
    } catch (error: any) {
        return next(new ErrorResponse('Error', 500, ["Error fetching transactions: " + error.message]));
    }
    
};

// Get a single entry by ID
export const getTransactionById = async (req: Request, res: Response, next: NextFunction) => {
    
        try {
            const { id } = req.params;
            const transaction: any = await Transaction.findById(id);
            const userId = req.user.id;
        
            if (!transaction || (transaction.user.toString() !== userId)) {
                return next(new ErrorResponse('Error', 401, ["Transaction not found"]))
            };

          res.status(200).json({error: false, data: transaction, message: "Transaction retrieved successfully"});
          return;
    } catch (error: any) {
        return next(new ErrorResponse('Error', 500, ["Error fetching transaction: " + error.message]));
    }
};

// Updating entry by ID
export const updateTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { date, amount, category, type, description } = req.body;
        const userId = req.user.id;
        const transaction: any = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!transaction || (transaction.user.toString() !== userId)) {
            return next(new ErrorResponse('Error', 401, ["Transaction not found"]));
        }
        res.status(200).json({error: false, data: transaction, message: "Transaction updated successfully"});
        return; 
    } catch (error: any) {
        return next(new ErrorResponse('Error', 500, ["Error updating transaction: " + error.message ])); 
    };
};

// Deleting entries by ID
export const deleteTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!transaction || (transaction.user.toString() !== req.user.id)) {
            return next(new ErrorResponse('Error', 401, ["Transaction not found or not authorized"])); 
        }
          return next(new ErrorResponse('Error', 200, ["Transaction deleted successfully"]));
    } catch (error: any) {
        return next(new ErrorResponse('Error', 500, ["Transaction deleting entry: " + error.message ])); 
    }
}

// Get monthly summary with income, expenses, and balance breakdown
export const getMonthlySummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { month, year } = req.query;
      const start = new Date(`${year}-${month}-01`);
      const end = new Date(start);
      end.setMonth(start.getMonth() + 1);
  
      const transactions = await Transaction.find({
        userId: req.user.id,
        date: { $gte: start, $lt: end },
      });
  
      const summary = transactions.reduce(
        (acc, transaction) => {
          if (transaction.type === "income") {
            acc.totalIncome += transaction.amount;
          } else {
            acc.totalExpenses += transaction.amount;
            acc.categoryBreakdown[transaction.category] = (acc.categoryBreakdown[transaction.category] || 0) + transaction.amount;
          }
          return acc;
        },
        { totalIncome: 0, totalExpenses: 0, categoryBreakdown: {} as Record<string, number>, balance: 0 }
      );
  
      summary.balance = summary.totalIncome - summary.totalExpenses;
      res.status(200).json({error: false, data: summary, message: "Monthly Transacation Summary retrieved successfully"});
    } catch (error: any) {
        return next(new ErrorResponse('Error', 500, ["Error fetching summary: " + error.message ])); 
    }
  };
  
// Get yearly summary for income, expenses, and balance
export const getYearlySummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { year } = req.query;
      const start = new Date(`${year}-01-01`);
      const end = new Date(`${parseInt(year as string, 10) + 1}-01-01`);
  
      const transactions = await Transaction.find({
        userId: req.user.id,
        date: { $gte: start, $lt: end },
      });
  
      const summary: any = transactions.reduce(
        (acc, transaction) => {
          if (transaction.type === "income") {
            acc.totalIncome += transaction.amount;
          } else {
            acc.totalExpenses += transaction.amount;
            acc.categoryBreakdown[transaction.category] = (acc.categoryBreakdown[transaction.category] || 0) + transaction.amount;
          }
          return acc;
        },
        { totalIncome: 0, totalExpenses: 0, categoryBreakdown: {} as Record<string, number>, balance: 0 }
      );
  
      summary.balance = summary.totalIncome - summary.totalExpenses;
      res.status(200).json({ error:false, data: summary, message: "Yearly Transacation Summary retrieved successfully" });
    } catch (error: any) {
        return next(new ErrorResponse('Error', 500, ["Error fetching summary: " + error.message ])); 
    }
  };
  

import { Request, Response, NextFunction } from 'express';
import ErrorResponse from "../utils/error.utils";
import  Budget  from '../model/Budget.model';
import { IBudget } from '../types/budget.types';
import Transaction from '../model/Transaction.model';

// Create or update a budget for a specific category and month
export const setBudget = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, category, amount, startDate, endDate } = req.body;
        const userId = req.user.id;

        let budget = await Budget.findOne({ userId, category, amount, startDate, endDate});
        if(budget){
            budget.amount = amount;
            budget.endDate = endDate;
        } else {
            // create new budget if it doesn't exist
            budget = new Budget({ userId, name, category, amount, startDate, endDate });
        }
        await budget.save();
        res.status(201).json({error: false, data: budget, message: "Budget set successfully" });
    } catch (error: any) {
        return next(new ErrorResponse('Error', 500, ["Error setting budget: " + error.message]));
    }
} 

  // Helper function to calculate total spending per category for the specified month
  const calculateMonthlySpending = async (userId: string, month: number, year: number) => {

    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 1);
  
    // Retrieve all expense entries for the month
    const transactions = await Transaction.find({
      userId,
      date: { $gte: start, $lt: end },
      type: 'expense'
    });
  
    // Calculate total spending by category
    return transactions.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);
  };

// Get all budgets for a specific month along with remaining amounts
export const getBudgetsForMonth = async (req: Request, res: Response,next: NextFunction) => {
    try {
      const { month, year } = req.query;
      const userId = req.user.id;
  
      // Retrieve budgets set for the user in the specified month and year
      const budgets = await Budget.find({ userId, month, year });
  
      // Calculate total spent in each category
      const spending = await calculateMonthlySpending(userId, parseInt(month as string), parseInt(year as string));
  
      // Add remaining amount to each budget based on spending
      const budgetSummaries = budgets.map(budget => ({
        category: budget.category || "unknown",
        budgetAmount: budget.amount,
        spent: spending[budget.category] || 0,
        remaining: Math.max(budget.amount - (spending[budget.category] || 0), 0)
      }));
  
      res.json({ error: false, data: budgetSummaries, message: "Budget set successfully" });
    } catch (error) {
        return next(new ErrorResponse('Error', 500, ["Error retrieving budgets"]));
    }
  };
  

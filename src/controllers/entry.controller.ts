import { RequestHandler, Request, Response } from "express";
import Entry from "../model/entry.model";

// create new entry
export const createEntry = async (req: Request, res: Response) => {
    try {
        const { date, amount, category, type, description } = req.body;
        const userId = req.user.id;

        if (!userId) {
            res.status(401).json({ error: true, data: null, message: "Unauthorized access" });
            return;
        }

        const entry = new Entry({ user: userId, date, amount, category, type, description });
        await entry.save();
        res.status(201).json(entry);
        return;
    } catch (error: any) {
        res.status(500).json({ error: true, data: null, "Error creating note: ": error.message });
        return;
    }
}

// Get all entries
export const getAllEntries = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;

        if (!userId) {
        res.status(401).json({ error: true, data: null, message: "Unauthorized access" });
        return;
        }

        const entries: any = await Entry.find({user: userId}).sort({createdAt: - 1});
        res.status(200).json(entries);
        return;
    } catch (error: any) {
        res.status(500).json({ error: true, data: null, "Error fetching entries": error.message });
        return; 
    }
};

// Get a single entry by ID
export const getEntryById = async (req: Request, res: Response) => {
    
        try {
            const { id } = req.params;
            const entry: any = await Entry.findById(id);
            const userId = req.user.id;
        
            if (!entry || entry.userId.toString() !== userId) {
                res.status(401).json({ error: true, data: null, message: "Entry not found" });
                return;
            }
          res.status(200).json(entry);
          return;
    } catch (error: any) {
        res.status(500).json({ error: true, data: null, "Error fetching entry": error.message });
        return;
    }
};

// Updating entry by ID
export const updateEntry = async (req: Request, res: Response) => {
    try {
        const { date, amount, category, type, description } = req.body;
        const userId = req.user.id;
        const entry = await Entry.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!entry || entry.userId.toString() !== userId) {
            res.status(401).json({ error: true, data: null, message: "Entry not found" });
            return;
        }
        res.status(200).json(entry);
        return; 
    } catch (error: any) {
        res.status(500).json({ error: true, data: null, "Error updating note": error.message });
        return; 
    };
};

// Deleting entries by ID
export const deleteEntry = async (req: Request, res: Response) => {
    try {
        const entry = await Entry.findByIdAndDelete(req.params.id);
        if (!entry || entry.userId.toString() !== req.user.id) {
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



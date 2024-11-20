import { Router } from 'express';
import { 
    createTransaction, 
    updateTransaction, 
    deleteTransaction, 
    getAllTransactions, 
    getTransactionById, 
    getMonthlySummary, 
    getYearlySummary 
} from '../controllers/transaction.controller';
import protect from '../middleware/auth.middleware';

const router = Router();

router.post('/', protect, createTransaction);
router.put('/:id', protect, updateTransaction);
router.delete('/:id', protect, deleteTransaction);
router.get('/', protect, getAllTransactions);
router.get('/:id', protect, getTransactionById);
router.get('/monthlySummary', getMonthlySummary);
router.get('/yearlySummary', getYearlySummary)

export default router;
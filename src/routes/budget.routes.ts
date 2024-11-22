import { Router } from 'express';
import { setBudget, getBudgetsForMonth } from '../controllers/budget.controller';

const router = Router();

router.post('/setbudget', setBudget);
router.post('/monthlybudget', getBudgetsForMonth);

export default router;
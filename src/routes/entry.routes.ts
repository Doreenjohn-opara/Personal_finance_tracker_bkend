import { Router } from 'express';
import { createEntry, updateEntry, deleteEntry, getAllEntries, getEntryById } from '../controllers/entry.controller';
import protect from '../middleware/auth.middleware';

const router = Router();

router.post('/', protect, createEntry);
router.put('/:id', protect, updateEntry);
router.delete('/:id', protect, deleteEntry);
router.get('/', protect, getAllEntries);
router.get('/:id', protect, getEntryById);

export default router;
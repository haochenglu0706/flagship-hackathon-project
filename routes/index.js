import { Router } from 'express';
import classesRouter from './classes.js';

const router = Router();

router.use('/classes', classesRouter);

export default router;
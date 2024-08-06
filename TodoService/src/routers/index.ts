import {Router} from 'express'
import todoRouter from './todo.router'
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use('/todo',authMiddleware, todoRouter);

export default router;
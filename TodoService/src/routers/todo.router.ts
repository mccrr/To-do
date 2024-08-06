import { Router } from "express";
import { getAllTodos,getDeletedTodos, getById, createTodo, deleteById } from '../controllers/todo.controller';

const todoRouter = Router();

todoRouter.get('/todos', getAllTodos);
todoRouter.get('/todos/deleted', getDeletedTodos);
todoRouter.get('/todos/:id',getById);
todoRouter.delete('/todos/:id', deleteById);
todoRouter.post('/todos', createTodo);

export default todoRouter;
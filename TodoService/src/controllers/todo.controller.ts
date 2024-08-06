import TodoService from '../services/todo.service';
import { User, Todo } from "../@types";
import { Request, Response, NextFunction } from "express";
import { validateRequiredFields } from "../helpers/utils";
import APIError from '../errors/APIError';

export const createTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const todo = req.body.todo;
        console.log('(controller) todo: ', todo);
        const updatedTodos = await TodoService.createTodo(req.validatedUser.id, todo);
        return res.status(200).json({
            success: true,
            data: updatedTodos
        })
    } catch (err) {
        next(err)
    }
}

export const getAllTodos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const todos = await TodoService.getAllTodos(req.validatedUser.id);
        return res.status(200).json({
            success: true,
            data: todos
        });
    } catch (err) {
        next(err)
    }
}

export const getDeletedTodos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const todos = await TodoService.getDeletedTodos(req.validatedUser.id);
        return res.status(200).json({
            success: true,
            data: todos
        });
    } catch (err) {
        next(err)
    }
}

export const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const todoId = parseInt(req.params.id);
        console.log('(controller) todoId: ', todoId);
        const todo = await TodoService.getById(req.validatedUser.id, todoId);
        if(!todo){
            throw new APIError(404,"TODO_NOT_FOUND", "The todo with this id does not exist");
        }
        return res.status(200).json({
            success: true,
            data: todo
        });
    } catch (err) {
        next(err);
    }
}

export const deleteById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const todoId = parseInt(req.params.id);
        await TodoService.deleteById(req.validatedUser.id, todoId);
         res.status(200).json({
            success: 200,
            data: null
        });
    } catch (err) {
        next(err);
    }
}
import { User } from "../@types";
import { Request, Response, NextFunction } from "express";
import { validateRequiredFields } from "../helpers/utils";
import { AuthService } from "../services/auth.service";

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    console.log("First line in signup controller");
    try {
        console.log("Second line in signup controller");
        const requiredFields = ['id', 'name', 'lastname', 'email', 'password', 'todos']
        const validatedFields = validateRequiredFields<User>(req, requiredFields)
        console.log("Fields have been validated");
        const newUser = await AuthService.signUp(validatedFields);

        return res.status(201).json({
            success: true,
            data: newUser
        });
    } catch (err) {
        next(err)
    }
}

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    console.log("First line in signIn controller");
    try {
        const requiredFields = ['email', 'password'];
        console.log("Before validating fields");
        const validatedFields = validateRequiredFields<Pick<User, 'email' | 'password'>>(req, requiredFields);
        console.log("Validated fields");
        const result = await AuthService.signIn(validatedFields);
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        next(err);
    }
}


export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshtoken } = req.body;
        const newAccessToken = await AuthService.refresh_token(refreshtoken);
        return res.status(200).json({
            success: true,
            accessToken: newAccessToken
        });
    } catch (err) {
        next(err);
    }
}
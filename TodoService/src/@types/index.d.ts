declare global {
    namespace Express {
        interface Request {
            validatedUser: SafeUser
        }
    }
}

export interface Todo {
    id: number;
    text: string;
    author: string;
    isCompleted: boolean;
    expireDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    lastname: string;
    todos: Todo[];
}

export type SafeUser = Omit<User, 'password'>
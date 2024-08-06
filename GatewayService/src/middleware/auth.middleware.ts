import { Request, Response, NextFunction } from 'express';
import APIError from '../errors/APIError';
import { SafeUser } from '../@types';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, _: Response, next: NextFunction) => {
  try {
    const providedAuth = req.headers.authorization;

    if (!providedAuth) {
      return next(new APIError(403, 'MISSING_ACCESS_TOKEN', 'Access token not provided'));
    }

    const accessToken = providedAuth.split(' ')[1]; // Extract token from "Bearer token"

    if (!accessToken) {
      return next(new APIError(403, 'INVALID_ACCESS_TOKEN', 'Invalid access token format'));
    }

    const TOKEN_SECRET = process.env.TOKEN_SECRET;
    if (!TOKEN_SECRET) {
      return next(new APIError(500, 'MISSING_SECRET_KEY', 'Token secret key not defined'));
    }

    // Verify the token
    const decoded = jwt.verify(accessToken, TOKEN_SECRET) as SafeUser;

    // Check if the decoded token matches the expected SafeUser type
    if (typeof decoded === 'object' && 'id' in decoded && 'email' in decoded && 'name' in decoded) {
      req.validatedUser = decoded;
      next();
    } else {
      return next(new APIError(403, 'INVALID_TOKEN', 'Invalid token'));
    }
    next();
  } catch (err) {
    return next(new APIError(403, 'TOKEN_VERIFICATION_FAILED', 'Token verification failed'));
  }
};

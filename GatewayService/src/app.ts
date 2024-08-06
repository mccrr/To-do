import express from 'express';
import { json, urlencoded } from 'body-parser';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { authMiddleware } from './middleware/auth.middleware';
import { Request, Response, NextFunction } from 'express';

const app = express();

app.use(urlencoded({ extended: false }));
app.use(json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

const authProxy = createProxyMiddleware({
  target: 'http://AuthService:4000/api/auth'
},
);

const todoProxy = createProxyMiddleware({
  target: 'http://TodoService:5000/api/todo'
  },
);

app.use('/api/auth', authProxy);
app.use('/api/todo', authMiddleware, todoProxy);

app.use((err:Error, req:Request, res:Response, next:NextFunction) => {
  console.error(err);
  res.status(500).send('Something went wrong');
});

export default app;

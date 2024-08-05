import { Router } from 'express'
import { signUp, signIn, refreshToken } from '../controllers/auth.controller'

const authRouter = Router()

authRouter.post('/signup', signUp)
authRouter.post('/signin', signIn)
authRouter.post('/refreshtoken', refreshToken)

export default authRouter
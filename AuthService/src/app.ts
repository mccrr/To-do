import express from 'express'
import { json, urlencoded } from 'body-parser'
import router from './routers'
import { globalErrorMiddleware } from './middleware/error.middleware'

const app = express()

app.use(urlencoded({ extended: false }))
app.use(json())


app.use('/', router)

app.use(globalErrorMiddleware)

export default app
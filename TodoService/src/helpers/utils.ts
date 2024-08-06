import { Request } from 'express'
import BaseError from '../errors/BaseError'
import APIError from '../errors/APIError'
import { DocumentNotFoundError } from 'couchbase'
import { JsonWebTokenError } from 'jsonwebtoken'

export const validateRequiredFields = <T>(req: Request, fields: string[]) => {
  const errors: string[] = []
  const requiredFieldsObj: Record<string, any> = {}

  fields.forEach((field) => {
    if (!req.body[field]) errors.push(field)
  })

  if (errors.length > 0)
    throw new APIError(400, 'MISSING_REQUIRED_FIELDS', `${errors.join(', ')} fields should be proivded`)

  fields.forEach((field) => (requiredFieldsObj[field] = req.body[field]))

  return requiredFieldsObj as T
}

export const isTrustedError = (err: Error) => {
  if (err instanceof BaseError) return err.isOperational
  return false
}

export const errorFilter = (err: Error) => {
  // If the error is a trusted error and an instance of BaseError, return it directly
  if (isTrustedError(err) && err instanceof BaseError) return err
  // Couchbae document not found error
  else if (err instanceof DocumentNotFoundError) {
    // @ts-ignore
    const id = err.cause.id
    console.log(err);
    return new APIError(404, 'DOCUMENT_NOT_FOUND', `No such document with ${id}`)
  }
  // JWT Error
  else if (err instanceof JsonWebTokenError) {
    // Invalid token
    if (err.message === 'invalid token')
      return new APIError(403, 'INVALID_ACCESS_TOKEN', 'Provided access token is not valid')
    // Token Expired
    else if (err.message === 'jwt expired')
      return new APIError(403, 'ACCESS_TOKEN_EXPIRED', 'Provided access token is expired')
  }
  console.log(err);
  return new APIError(500, 'INTERNAL_SERVER_ERROR', 'Something went wrong internaly')
}
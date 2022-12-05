import { IAuthor } from './../models/Author';
import * as Joi from 'joi'
import { ObjectSchema } from 'joi'
import { NextFunction, Response, Request } from 'express'

export const ValidateSchema = (schema: ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body)

      next()
    } catch (error) {
      console.log({ error })
      return res.status(422).json({ error })
    }
  }
}

export const Schemas = {
  author: {
    create: Joi.object<IAuthor>({
      name: Joi.string().required(),
    }),
    update: Joi.object<IAuthor>({
      name: Joi.string().required(),
    })
  },
}




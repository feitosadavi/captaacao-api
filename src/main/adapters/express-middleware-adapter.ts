import { NextFunction, Request, Response } from 'express'
import { Middleware } from '@/presentation/protocols'

export const adaptMiddleware = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const request = { // adapta o request
      accessToken: req.headers?.['x-access-token'],
      id: req.params,
      ...(req.headers || {})
    }
    const httpResponse = await middleware.handle(request)
    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body) // coloco o body da resposta, no caso o accountId, na requisição
      next() // passa pra frente
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}

import { AuthMiddleware } from '@/presentation/middlewares'
import { Middleware } from '@/presentation/protocols'
import { makeDbLoadAccountByToken } from './db-load-account-by-token-factory'

export const makeAuthMiddleware = (profiles?: string[]): Middleware => {
  return new AuthMiddleware(makeDbLoadAccountByToken(), profiles)
}

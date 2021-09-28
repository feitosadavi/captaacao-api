import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'
import { Middleware } from '@/presentation/protocols'
import { makeDbLoadAccountByToken } from './db-load-account-by-token-factory'

export const makeAuthMiddleware = (role?: string, checkId?: boolean): Middleware => {
  return new AuthMiddleware(makeDbLoadAccountByToken(), role, checkId)
}

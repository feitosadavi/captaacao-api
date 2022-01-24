/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { adaptRoute } from '../adapters/express-route-adapter'
import {
  makeDeleteAccountsController,
  makeLoadAccountsController,
  makeLoginController,
  makeSignUpController,
  makeAuthMiddleware
} from '@/main/factories'
import { adminAuth } from '../middlewares/admin-auth'
export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
  router.get('/accounts', adminAuth, adaptRoute(makeLoadAccountsController()))
  router.get('/accounts/:id', adminAuth, adaptRoute(makeLoadAccountsController()))
  router.delete('/accounts/delete/:id', adaptMiddleware(makeAuthMiddleware(null, true)), adaptRoute(makeDeleteAccountsController()))
}

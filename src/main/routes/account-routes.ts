/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeLoadAccountsController } from '../factories/controllers/account/load-accounts/load-accounts-factory'
import { makeLoginController } from '../factories/controllers/account/login/login-controller-factory'
import { makeSignUpController } from '../factories/controllers/account/signup/signup-controller-factory'
import { adminAuth } from '../middlewares/admin-auth'
export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
  router.get('/accounts', adminAuth, adaptRoute(makeLoadAccountsController()))
}

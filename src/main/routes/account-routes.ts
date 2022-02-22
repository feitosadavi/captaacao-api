/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptRoute, adaptMiddleware } from '@/main/adapters'
import {
  makeDeleteAccountsController,
  makeLoadAccountsController,
  makeLoginController,
  makeSignUpController,
  makeAuthMiddleware,
  makeUpdateAccountControllerFactory,
  makePasswordRecoverController,
  makeCheckCodeController
} from '@/main/factories'
import { adminAuth, auth } from '@/main/middlewares'
import { makeUpdatePasswordControllerFactory } from '../factories/controllers/account/update-password-controller-factory'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
  router.post('/account/password-recover', adaptRoute(makePasswordRecoverController()))
  router.post('/account/check-code', adaptRoute(makeCheckCodeController()))

  router.get('/accounts', adminAuth, adaptRoute(makeLoadAccountsController()))
  router.get('/accounts/:id', adminAuth, adaptRoute(makeLoadAccountsController()))

  router.delete('/accounts/delete/:id', adaptMiddleware(makeAuthMiddleware(null, true)), adaptRoute(makeDeleteAccountsController()))

  router.put('/account/update', auth, adaptRoute(makeUpdateAccountControllerFactory()))
  router.put('/account/update-password/:id', adaptRoute(makeUpdatePasswordControllerFactory()))
}

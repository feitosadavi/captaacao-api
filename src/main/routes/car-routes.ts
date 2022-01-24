/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import {
  makeAddCarController,
  makeLoadCarByIdController,
  makeLoadCarController
} from '@/main/factories'
import { adminAuth } from '../middlewares/admin-auth'
// import { auth } from '../middlewares/auth'

export default (router: Router): void => {
  router.post('/cars', adminAuth, adaptRoute(makeAddCarController()))
  router.get('/cars', adaptRoute(makeLoadCarController()))

  router.get('/cars/:id', adaptRoute(makeLoadCarByIdController()))
}

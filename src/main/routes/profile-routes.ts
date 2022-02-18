/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import {
  makeAddProfileController,
  makeDeleteProfileController,
  makeAuthMiddleware
} from '@/main/factories'
import { adminAuth } from '../middlewares/admin-auth'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'

export default (router: Router): void => {
  router.post('/profile', adminAuth, adaptRoute(makeAddProfileController()))
  router.delete('/profile/delete/:id', adaptMiddleware(makeAuthMiddleware(null, true)), adaptRoute(makeDeleteProfileController()))
}
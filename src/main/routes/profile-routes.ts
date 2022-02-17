/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import {
  makeAddProfileController
} from '@/main/factories'
import { adminAuth } from '../middlewares/admin-auth'

export default (router: Router): void => {
  router.post('/profile', adminAuth, adaptRoute(makeAddProfileController()))
}

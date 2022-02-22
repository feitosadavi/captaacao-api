/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptRoute, adaptMiddleware } from '@/main/adapters'
import {
  makeAddProfileController,
  makeLoadProfilesController,
  makeDeleteProfileController,
  makeAuthMiddleware
} from '@/main/factories'
import { adminAuth } from '@/main/middlewares'

export default (router: Router): void => {
  router.post('/profile', adminAuth, adaptRoute(makeAddProfileController()))
  router.get('/profiles/all', adaptRoute(makeLoadProfilesController()))
  router.delete('/profile/delete/:id', adaptMiddleware(makeAuthMiddleware(null, true)), adaptRoute(makeDeleteProfileController()))
}

/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import {
  makeAddPostController,
  makeLoadPostByIdController,
  makeLoadPostController
} from '@/main/factories'
import { adminAuth } from '../middlewares/admin-auth'
// import { auth } from '../middlewares/auth'

export default (router: Router): void => {
  router.post('/posts', adminAuth, adaptRoute(makeAddPostController()))
  router.get('/posts', adaptRoute(makeLoadPostController()))

  router.get('/posts/:id', adaptRoute(makeLoadPostByIdController()))
}

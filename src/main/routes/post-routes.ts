/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import {
  makeAddPostController,
  makeLoadPostByIdController,
  makeLoadAllPostsController
} from '@/main/factories'
import { adminAuth } from '../middlewares/admin-auth'
// import { auth } from '../middlewares/auth'

export default (router: Router): void => {
  router.post('/posts', adminAuth, adaptRoute(makeAddPostController()))
  router.get('/posts/all', adaptRoute(makeLoadAllPostsController()))

  router.get('/posts/:id', adaptRoute(makeLoadPostByIdController()))
}

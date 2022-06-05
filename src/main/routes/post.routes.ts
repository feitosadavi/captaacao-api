/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptRoute, adaptMiddleware } from '@/main/adapters'
import { makeAddPostController, makeAuthMiddleware } from '@/main/factories'
import { multer } from '../middlewares'

export default (router: Router): void => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.post('/post', multer('photos'), adaptMiddleware(makeAuthMiddleware()), adaptRoute(makeAddPostController()))
}

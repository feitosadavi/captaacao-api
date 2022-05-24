import { Router } from 'express'
import { MultipartParser } from '@/presentation/middlewares'
import { adaptRoute, adaptMiddleware } from '@/main/adapters'
import { makeAddPostController, makeAuthMiddleware } from '@/main/factories'
import { multer } from '@/main/middlewares'

export default (router: Router): void => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.post('/post', adaptMiddleware(makeAuthMiddleware()), adaptMiddleware(new MultipartParser()), multer('photos'), adaptRoute(makeAddPostController()))
}

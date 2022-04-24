import { Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { makeSignUpController } from '@/main/factories'
import { multer } from '@/main/middlewares'

export default (router: Router): void => {
  router.post('/signup', multer('profilePhoto'), adaptRoute(makeSignUpController()))
}

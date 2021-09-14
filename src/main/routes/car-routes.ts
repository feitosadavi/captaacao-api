/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeAddCarController } from '../factories/controllers/car/add-car/add-car-controller-factory'
import { makeLoadCarByIdController } from '../factories/controllers/car/load-car-by-id/load-car-by-id-factory'
import { makeLoadCarController } from '../factories/controllers/car/load-car/load-car-factory'
import { adminAuth } from '../middlewares/admin-auth'
// import { auth } from '../middlewares/auth'

export default (router: Router): void => {
  router.post('/cars', adminAuth, adaptRoute(makeAddCarController()))
  router.get('/cars', adaptRoute(makeLoadCarController()))

  router.get('/cars/:id', adaptRoute(makeLoadCarByIdController()))
}

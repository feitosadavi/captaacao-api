import request from 'supertest'

import { setupApp } from '@/main/config/app'
import { Express } from 'express'

describe('Body Parser Middleware', () => {
  let app: Express
  beforeAll(async () => {
    app = await setupApp()
  })
  test('Should request parse body as json', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })
    await request(app)
      .post('/test_body_parser')
      .send({ name: 'Rodrigo' })
      .expect({ name: 'Rodrigo' })
  })
})

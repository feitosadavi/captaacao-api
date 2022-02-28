import { setupApp } from '@/main/config/app'

import request from 'supertest'
import { Express } from 'express'

let app: Express
describe('Content Type Middleware', () => {
  beforeAll(async () => {
    app = await setupApp()
  })
  test('Should return default Content Type as json', async () => {
    app.get('/test_content_type_json', (req, res) => {
      res.send('')
    })
    await request(app)
      .get('/test_content_type_json')
      .expect('content-type', /json/) // se existir .json na resposta, ele aceita
  })

  test('Should return xml when forced', async () => {
    app.get('/test_content_type_xml', (req, res) => {
      res.type('xml')
      res.send('')
    })
    await request(app)
      .get('/test_content_type_xml')
      .expect('content-type', /xml/)
  })
})

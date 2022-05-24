import request from 'supertest'
import { Express } from 'express'

import { multipartParser } from '@/main/middlewares'
import { setupApp } from '@/main/config/app'

describe('MultipartParser Middleware', () => {
  let app: Express
  beforeAll(async () => {
    app = await setupApp()
  })
  test('should multipart parser parse the json values into its respectives values', async () => {
    const data = {
      string: 'string',
      array: '[item1, item2]',
      number: '0',
      boolean: 'true'
    }

    app.post('/test_multipart_parser', multipartParser, (req, res) => {
      res.json({
        parsed: req.body
      })
    })
    const res = await request(app).post('/test_multipart_parser').send(data)
    expect(res.body.parsed).toEqual({
      string: 'string',
      array: ['item1', 'item2'],
      number: 0,
      boolean: true
    })
  })
})

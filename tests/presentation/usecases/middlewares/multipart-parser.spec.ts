import request from 'supertest'
import { Express } from 'express'

import { MultipartParser } from '@/presentation/middlewares'
import { setupApp } from '@/main/config/app'
import { adaptMiddleware } from '@/main/adapters'

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
      boolean: 'true',
      nested: {
        number: '123',
        numArr: '[1, 2, 3]'
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    app.post('/test_multipart_parser', adaptMiddleware(new MultipartParser()), (req, res) => {
      res.json({
        parsed: req
      })
    })
    const res = await request(app).post('/test_multipart_parser').field('queijo', '1')
    expect(res.body.parsed).toEqual({
      string: 'string',
      array: ['item1', 'item2'],
      number: 0,
      boolean: true,
      nested: {
        number: 123,
        numArr: [1, 2, 3]
      }
    })
  })
})

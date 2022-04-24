import request from 'supertest'
import { Express } from 'express'

import { setupApp } from '@/main/config/app'
import { multer } from '@/main/middlewares/multer'
import fs from 'fs'

describe('Multer Middleware', () => {
  let app: Express
  let syncFiles: any[]
  const dir = './tests/main/test_tmp'

  const createFiles = (): void => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir)
    syncFiles = ['file1', 'file2'].map(fileName => fs.openSync(`${dir}/${fileName}.png`, 'w'))
  }

  beforeAll(async () => {
    app = await setupApp()
    createFiles()
  })

  afterAll(() => {
    syncFiles.map(sf => fs.closeSync(sf))
    fs.rmSync(dir, { recursive: true, force: true })
  })

  const mockRoute = (name: string): void => {
    app.post('/test_multer', multer(name), (req, res) => {
      console.log(req.clientFiles)
      res.json({
        files: req.clientFiles
      })
    })
  }

  test('should multer store a single file', async () => {
    mockRoute('profile')
    const { body: { files } } = await request(app).post('/test_multer')
      .attach('profile', `${dir}/file1.png`)
    expect(files[0].fileName.includes('profile')).toBe(true)
  })

  test('should multer store multiple files', async () => {
    mockRoute('profile')
    const { body: { files } } = await request(app).post('/test_multer')
      .attach('profile', `${dir}/file1.png`)
      .attach('profile', `${dir}/file2.png`)
    expect(files[0].fileName.includes('profile')).toBe(true)
    expect(files[1].fileName.includes('profile')).toBe(true)
  })
})

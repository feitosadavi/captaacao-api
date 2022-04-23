/* eslint-disable no-unused-expressions */
import { ServerError } from '@/presentation/errors'

import { RequestHandler } from 'express'

import m from 'multer'
import path from 'path'

export const multer = (type: 'single' | 'multiple' | 'array' | 'none', name: string): RequestHandler =>
  (req, res, next) => {
    const storage = m.diskStorage({
      destination: 'tmp/',
      filename: (req, file, callback) => {
        const fileName = `Captacao-${name}-${Date.now()}${path.extname(file.originalname)}`
        return callback(null, fileName)
      }
    })
    const store = m({ storage })
    const upload = store.array(name, 4)

    upload(req, res, error => {
      if (error) {
        return res.status(500).json({ error: new ServerError(error).message })
      }

      if (req.files) {
        const files = (req.files as any[]).map((file: any) => ({
          fileName: file.filename,
          buffer: file.buffer,
          mimeType: file.mimetype
        }))
        req.clientFiles = files
      }
      next()
    })
  }

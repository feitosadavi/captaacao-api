/* eslint-disable no-unused-expressions */
import { ServerError } from '@/presentation/errors'

import { RequestHandler } from 'express'

import m from 'multer'
import path from 'path'

export const multer = (name: string): RequestHandler =>
  (req, res, next) => {
    const storage = m.memoryStorage()
    const store = m({ storage })
    const upload = store.array(name, 4)

    upload(req, res, error => {
      if (error) {
        return res.status(500).json({ error: new ServerError(error).message })
      }

      if (req.files) {
        const files = (req.files as any[]).map((file: any) => ({
          fileName: process.env.PRODUCTION ? `Captacao-${name}-${Date.now()}${path.extname(file.originalname)}` : file.originalname,
          buffer: file.buffer,
          mimeType: file.mimetype
        }))
        req.clientFiles = files
      }
      next()
    })
  }

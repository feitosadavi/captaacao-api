declare module Express {
  type CustomFile = {
    fileName: string
    buffer: Buffer
    mimeType: string
  }
  interface Request {
    accountId?: string
    clientFiles?: CustomFile[]
  }
}

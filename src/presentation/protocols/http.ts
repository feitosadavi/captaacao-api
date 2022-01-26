export type HttpResponse = {
  statusCode: number
  body: any
}

export type HttpRequest<B = any, H = any, P = any> = {
  body?: B
  headers?: H
  params?: P
  accountId?: any
}

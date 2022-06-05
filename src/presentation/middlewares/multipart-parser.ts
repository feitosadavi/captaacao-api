import { serverSuccess, serverError } from '@/presentation/helpers'
import { HttpResponse, Middleware } from '@/presentation/protocols'

/**
 * Multipart parser is a middleware to parse Form Data fields to its original json values
**/

const isNumeric = (strOrN: number | string): boolean => {
  if (typeof strOrN !== 'string' && typeof strOrN !== 'number') return false // we only process strings!
  return !isNaN(strOrN as unknown as any) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(strOrN as unknown as any)) // ...and ensure strings of whitespace fail
}

const isObject = (obj: Record<any, any>): boolean => {
  if (
    typeof obj === 'object' &&
    !Array.isArray(obj) &&
    obj !== null
  ) return true
}

const isNestedObj = (obj: any): boolean => {
  if (!isObject(obj)) return false
  const keys = Object.keys(obj)
  if (!keys) return false
  for (const key of keys) {
    if (obj[key]) return true
    else return false
  }
}

const smallParse = (item: any): any => {
  if (item === 'true' || item === 'false') {
    item = Boolean(item)
  } else if (isNumeric(item)) {
    item = Number(item)
  } else if (typeof item === 'string' && item.includes('[')) {
    item = item.replace('[', '').replace(']', '').split(', ')
  }
  return item
}

export class MultipartParser implements Middleware {
  // eslint-disable-next-line @typescript-eslint/require-await
  async handle (request: any): Promise<HttpResponse> {
    try {
      console.log(request)
      const parse = (obj: Record<any, any>): Record<any, any> => {
        const parsedParams = { ...obj }
        for (const key of Object.keys(parsedParams)) {
          parsedParams[key] = smallParse(obj[key])
          if (Array.isArray(parsedParams[key])) {
            parsedParams[key] = parsedParams[key].map(item => smallParse(item))
          }
          if (isNestedObj(parsedParams[key])) {
            const nested = parse(parsedParams[key])
            parsedParams[key] = { ...nested }
          }
        }
        return parsedParams
      }

      const parsed = parse(request.body)

      return serverSuccess({ body: parsed })
    } catch (error) {
      return serverError(error)
    }
  }
}

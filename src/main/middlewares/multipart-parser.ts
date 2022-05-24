import { Request, Response, NextFunction } from 'express'

/**
 * Multipart parser is a middleware to parse Form Data fields to its original json values
**/

const isNumeric = (strOrN: number | string): boolean => {
  if (typeof strOrN !== 'string' && typeof strOrN !== 'number') return false // we only process strings!
  return !isNaN(strOrN as unknown as any) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(strOrN as unknown as any)) // ...and ensure strings of whitespace fail
}

export const multipartParser = (req: Request, res: Response, next: NextFunction): void => {
  const parsedParams = { ...req.body }
  for (const key of Object.keys(req.body)) {
    const item = parsedParams[key]
    if (item === 'true' || item === 'false') {
      parsedParams[key] = Boolean(item)
    } else if (isNumeric(item)) {
      parsedParams[key] = Number(item)
    } else if (typeof item === 'string' && item.includes('[')) {
      console.log(item.replace('[', '').replace(']', '').split(', '))
      parsedParams[key] = item.replace('[', '').replace(']', '').split(', ')
    }
  }
  req.body = parsedParams

  next()
}

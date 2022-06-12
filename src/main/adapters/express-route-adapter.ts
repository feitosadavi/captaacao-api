import { Request, Response } from 'express'
import { Controller } from '@/presentation/protocols'

// o express espera na declaração da rota uma função que tenha parâmetros req e res
// então no adaptRoute eu retorno uma função com tal configuração
// através do padrão de projeto adapter, conseguimos desaclopar a aplicação do express
// desta forma, caso precisemos trocar o framework, basta modificar o adapter
export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    // eslint-disable-next-line dot-notation
    const httpRequest = {
      ...(req.body || {}),
      ...(req.params || {}),
      clientFiles: (req as any).clientFiles,
      accountId: (req as any).accountId
    }
    const httpResponse = await controller.handle(httpRequest)

    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      res.status(httpResponse.statusCode).json(httpResponse.body)
      // precisamos retornar um status code e um json, pois é a forma que o express entende um res
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}

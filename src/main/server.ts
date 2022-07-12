/* eslint-disable @typescript-eslint/restrict-plus-operands */
import 'module-alias/register'

import { MongoHelper } from '@/infra/db/mongodb'
import env from './config/env'

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    await MongoHelper.setupIndexes()
    // import do app aqui dentro para garantir que não irá importar módulos que dependam do banco de dados
    const { setupApp } = await import('./config/app')
    const app = await setupApp()
    app.listen(env.port, () => console.log(`Server runing at ${env.isProd ? env.apiUrl : 'http://localhost:' + env.port}`))
  })
  .catch(console.error)

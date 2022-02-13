import 'module-alias/register'
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper'
import env from './config/env'

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    // import do app aqui dentro para garantir que não irá importar módulos que dependam do banco de dados
    const app = (await import('./config/app')).default
    app.listen(env.port, () => console.log(`Server runing at http://localhost:${env.port}`))
  })
  .catch(console.error)

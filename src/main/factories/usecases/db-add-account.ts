import { AddAccount } from '@/domain/usecases'
import { DbAddAccount } from '@/data/usecases'
import { BcryptAdapter } from '@/infra/cryptography'
import { AccountMongoRepository } from '@/infra/db/mongodb'
import { AwsS3FileStorage } from '@/infra/gateways'
import env from '@/main/config/env'

export const makeDbAddAccount = (): AddAccount => {
  const salt = 12

  const accountMongoRepository = new AccountMongoRepository()
  const awsS3FileStorage = new AwsS3FileStorage(
    env.s3.accessKey,
    env.s3.secret,
    env.s3.bucket
  )
  const bcryptAdapter = new BcryptAdapter(salt)
  return new DbAddAccount(bcryptAdapter, awsS3FileStorage, accountMongoRepository, accountMongoRepository)
}

import { ObjectID } from 'mongodb'
import { MongoHelper } from './mongo-helper'

import { AccountModel } from '@/domain/models'
import {
  AddAccountRepository,
  DeleteAccountRepository,
  LoadAccountByCodeRepository,
  LoadAccountByEmailRepository,
  LoadAccountByIdRepository,
  LoadAccountByTokenRepository,
  LoadAllAccountsRepository,
  UpdateAccessTokenRepository,
  UpdateAccountRepository,
  UpdatePasswordRepository
} from '@/data/protocols'

export class AccountMongoRepository implements AddAccountRepository,
  LoadAllAccountsRepository,
  LoadAccountByIdRepository,
  LoadAccountByEmailRepository,
  LoadAccountByCodeRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository,
  UpdateAccountRepository,
  UpdatePasswordRepository,
  DeleteAccountRepository {
  async addAccount (params: AddAccountRepository.Params): AddAccountRepository.Result {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const result = await accountsCollection.insertOne(params)
    return !!result.insertedId
  }

  async loadAll (): LoadAllAccountsRepository.Result {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const accounts = await accountsCollection.find({}).toArray()
    return accounts && MongoHelper.mapCollection(accounts)
  }

  async loadById ({ id }: LoadAccountByIdRepository.Params): LoadAccountByIdRepository.Result {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const account = await accountsCollection.findOne({ _id: new ObjectID(id) })
    return account && MongoHelper.map(account)
  }

  async loadByEmail ({ email }: LoadAccountByEmailRepository.Params): LoadAccountByEmailRepository.Result {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const account = await accountsCollection.findOne({ email })
    return account && MongoHelper.map(account)
  }

  async loadByCode ({ code }: LoadAccountByCodeRepository.Params): LoadAccountByCodeRepository.Result {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const account = await accountsCollection.findOne({ 'code.number': code })
    return account && MongoHelper.map(account)
  }

  async loadByToken (params: LoadAccountByTokenRepository.Params): LoadAccountByTokenRepository.Result {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    let account: AccountModel
    if (params.role) {
      account = await accountsCollection.findOne({
        accessToken: params.accessToken,
        $or: [{ // só aceita o role nulo ou o role admin
          params: params.role
        }, {
          role: 'admin'
        }]
      })
    } else {
      account = await accountsCollection.findOne({ accessToken: params.accessToken })
    }
    return account && MongoHelper.map(account)
  }

  async updateAccessToken ({ id, accessToken }: UpdateAccessTokenRepository.Params): UpdateAccessTokenRepository.Result {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.updateOne({ _id: id },
      {
        $set: { accessToken }
      }
    )
  }

  async updateAccount (params: UpdateAccountRepository.Params): UpdateAccountRepository.Result {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.updateOne({ _id: params.id },
      {
        $set: { ...params.fields }
      }
    )
    return true
  }

  async updatePassword ({ id, password }: UpdatePasswordRepository.Params): UpdatePasswordRepository.Result {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.updateOne({ _id: id },
      {
        $set: { password }
      }
    )
    return true
  }

  async deleteAccount ({ id }: DeleteAccountRepository.Params): DeleteAccountRepository.Result {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const deletionResult = await accountsCollection.deleteOne({ _id: new ObjectID(id) })
    return deletionResult.deletedCount === 1
  }
}

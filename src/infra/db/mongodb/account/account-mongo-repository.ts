import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import { LoadAccountByIdRepository } from '@/data/protocols/db/account/load-account-by-id-repository'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import { LoadAccountsRepository } from '@/data/protocols/db/account/load-accounts-repository'
import { UpdateAccessTokenRepository } from '@/data/usecases/authentication/db-authentication-protocols'
import { AccountModel } from '@/domain/models/account'
import { AddAccountParams } from '@/domain/usecases/account/add-account'
import { ObjectID } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountsRepository, LoadAccountByEmailRepository,
  LoadAccountByTokenRepository, UpdateAccessTokenRepository, LoadAccountByIdRepository {
  async add (accountData: AddAccountParams): Promise<AccountModel> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const result = await accountsCollection.insertOne(accountData)
    const account = result.ops[0]
    return MongoHelper.map(account) // converte o _id para id
  }

  async loadAccounts (): Promise<any> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const accounts = await accountsCollection.find({}).toArray()
    return accounts && MongoHelper.mapCollection(accounts)
  }

  async loadById (id: string): Promise<AccountModel> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const account = await accountsCollection.findOne({ _id: new ObjectID(id) })
    return account && MongoHelper.map(account)
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const account = await accountsCollection.findOne({ email })
    return account && MongoHelper.map(account)
  }

  async loadByToken (token: string, role?: string): Promise<AccountModel> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    let account: AccountModel
    if (role) {
      account = await accountsCollection.findOne({ //
        accessToken: token,
        $or: [{ // só aceita o role nulo ou o role admin
          role
        }, {
          role: 'admin'
        }]
      })
    } else {
      account = await accountsCollection.findOne({ accessToken: token })
    }
    return account && MongoHelper.map(account)
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.updateOne({ _id: id },
      {
        $set: { accessToken: token }
      }
    )
  }
}

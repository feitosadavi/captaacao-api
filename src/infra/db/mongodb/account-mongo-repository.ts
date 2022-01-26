import {
  AddAccountRepository,
  DeleteAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByIdRepository,
  LoadAccountByTokenRepository,
  LoadAccountsRepository,
  UpdateAccessTokenRepository,
  UpdateAccountRepository
} from '@/data/protocols'
import { AccountModel } from '@/domain/models'
import { ObjectID } from 'mongodb'
import { MongoHelper } from './mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountsRepository, LoadAccountByEmailRepository,
  LoadAccountByTokenRepository, UpdateAccessTokenRepository, UpdateAccountRepository, LoadAccountByIdRepository, DeleteAccountRepository {
  async add (accountData: AddAccountRepository.Params): Promise<boolean> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const result = await accountsCollection.insertOne(accountData)
    return !!result.insertedId
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
      account = await accountsCollection.findOne({
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

  async update (params: UpdateAccountRepository.Params): Promise<UpdateAccountRepository.Result> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.updateOne({ _id: params.id },
      {
        $set: { ...params.fields }
      }
    )
    return true
  }

  async deleteAccount (id: string): Promise<boolean> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const deletionResult = await accountsCollection.deleteOne({ _id: id })
    return deletionResult.deletedCount === 1
  }
}

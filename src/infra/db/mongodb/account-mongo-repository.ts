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

  async loadByToken ({ accessToken, profiles }: LoadAccountByTokenRepository.Params): LoadAccountByTokenRepository.Result {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    let account: AccountModel
    if (profiles?.length > 0) {
      /**
       * An account can have various profiles, so a needed a way to check if its some profile from account
       * could match with profiles from loadByToken params, so a had to build this 'orQuery' in a very 'gambiarra' way :)
      */
      const orQuery = []
      for (const profile of profiles) {
        orQuery.push({ profiles: { $in: [profile] } })
      }
      account = await accountsCollection.findOne({
        accessToken: accessToken,
        $or: orQuery
      })
    } else {
      account = await accountsCollection.findOne({ accessToken: accessToken })
    }
    return account && MongoHelper.map(account)
  }

  async updateAccessToken ({ id, accessToken }: UpdateAccessTokenRepository.Params): UpdateAccessTokenRepository.Result {
    console.log({ updateAccessToekn: accessToken })
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const res = await accountsCollection.updateOne({ _id: id },
      {
        $set: { accessToken }
      }
    )
    console.log({ result: res.result })
    console.log({ count: res.modifiedCount })
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

import { ObjectId } from 'mongodb'
import { MongoHelper } from './mongo-helper'

import { AccountModel } from '@/domain/models'
import {
  AddAccountRepository,
  AddFavouritePostRepository,
  DeleteAccountRepository,
  LoadAccountByCodeRepository,
  LoadAccountByEmailRepository,
  LoadAccountByIdRepository,
  LoadAccountByTokenRepository,
  LoadAllAccountsRepository,
  RemoveFavouritePostRepository,
  UpdateAccessTokenRepository,
  UpdateAccountRepository,
  UpdatePasswordRepository
} from '@/data/protocols'

export class AccountMongoRepository implements
  AddAccountRepository,
  AddFavouritePostRepository,
  DeleteAccountRepository,
  LoadAccountByCodeRepository,
  LoadAccountByEmailRepository,
  LoadAccountByIdRepository,
  LoadAccountByTokenRepository,
  LoadAllAccountsRepository,
  RemoveFavouritePostRepository,
  UpdateAccessTokenRepository,
  UpdateAccountRepository,
  UpdatePasswordRepository {
  async addAccount (params: AddAccountRepository.Params): AddAccountRepository.Result {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const result = await accountsCollection.insertOne(params)
    console.log(result)
    return !!result.insertedId
  }

  async loadAll (): LoadAllAccountsRepository.Result {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const accountsNonMappedId = await accountsCollection.aggregate([
      {
        $lookup: {
          from: 'posts',
          localField: 'favouritesList',
          foreignField: '_id',
          as: 'favouritesList'
        }
      }
    ]).toArray()
    const accountMappedId = accountsNonMappedId.map(account => {
      const favouritesList = account?.favouritesList
      if (favouritesList) {
        account.favouritesList = MongoHelper.mapCollection(favouritesList)
      }
      return account
    })
    return accountMappedId && MongoHelper.mapCollection(accountMappedId)
  }

  async loadById ({ id }: LoadAccountByIdRepository.Params): LoadAccountByIdRepository.Result {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const accountsNonMappedId = await accountsCollection.aggregate([
      {
        $match: { $expr: { $eq: ['$_id', new ObjectId(id)] } }
      },
      {
        $lookup: {
          from: 'posts',
          localField: 'favouritesList',
          foreignField: '_id',
          as: 'favouritesList'
        }
      }
    ]).toArray()
    if (accountsNonMappedId[0]?.favouritesList.length > 0) {
      accountsNonMappedId[0].favouritesList = MongoHelper.mapCollection(accountsNonMappedId[0].favouritesList)
    }
    return accountsNonMappedId[0] && MongoHelper.map(accountsNonMappedId[0])
  }

  async loadByEmail ({ email }: LoadAccountByEmailRepository.Params): LoadAccountByEmailRepository.Result {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const accountsNonMappedId = await accountsCollection.aggregate([
      {
        $match: { $expr: { $eq: ['$email', email] } }
      },
      {
        $lookup: {
          from: 'posts',
          localField: 'favouritesList',
          foreignField: '_id',
          as: 'favouritesList'
        }
      }
    ]).toArray()
    if (accountsNonMappedId[0]?.favouritesList.length > 0) {
      accountsNonMappedId[0].favouritesList = MongoHelper.mapCollection(accountsNonMappedId[0].favouritesList)
    }
    return accountsNonMappedId[0] && MongoHelper.map(accountsNonMappedId[0])
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
      account = await accountsCollection.find({
        accessToken: accessToken,
        $or: orQuery
      }).toArray()[0]
    } else {
      account = await accountsCollection.findOne({ accessToken: accessToken }) as any
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

  async addFavourite ({ favouritePostId, id }: AddFavouritePostRepository.Params): AddFavouritePostRepository.Result {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const res = await accountsCollection.updateOne({ _id: new ObjectId(id) },
      {
        $addToSet: {
          favouritesList: new ObjectId(favouritePostId) // corrigir para favourtieList
        }
      }
    )
    return res.modifiedCount > 0
  }

  async removeFavourite ({ favouritePostId, id }: AddFavouritePostRepository.Params): AddFavouritePostRepository.Result {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const res = await accountsCollection.updateOne({ _id: new ObjectId(id) },
      { $pull: { favouritesList: new ObjectId(favouritePostId) } }
    )
    return res.modifiedCount > 0
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
    const deletionResult = await accountsCollection.deleteOne({ _id: new ObjectId(id) })
    return deletionResult.deletedCount === 1
  }
}

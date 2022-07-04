import MockDate from 'mockdate'
import { Collection, ObjectId } from 'mongodb'

import { AccountModel, PostModel } from '@/domain/models'
import { MongoHelper, AccountMongoRepository } from '@/infra/db/mongodb'

import { mockAccountParams, mockAccountConfirmationCode } from '@tests/domain/mocks'
import { mockAccountRepositoryParams, mockPostsRepositoryParams } from '@tests/data/mocks'

describe('Account Mongo Repository', () => {
  let accountsCollection: Collection
  let postsCollection: Collection

  // antes e depois de cada teste de integração, precisamos conectar e desconectar do banco
  beforeAll(async () => {
    MockDate.set(new Date()) // congela a data com base no valor inserido
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    MockDate.reset() // congela a data com base no valor inserido
    await MongoHelper.disconnect()
  })

  // removo todos os registros da tabela antes de cada teste. Para não populuir as tabelas
  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
    postsCollection = await MongoHelper.getCollection('posts')
    await postsCollection.deleteMany({})
  })

  type InsertedResult<T = any> = Omit<T, 'id'> & { _id: ObjectId }

  const insertPostAndReturnResult = async (postedBy?: ObjectId): Promise<InsertedResult<PostModel>> => {
    const res = await postsCollection.insertOne({ ...mockPostsRepositoryParams()[0], postedBy: postedBy || new ObjectId() })
    const insertedPosts = await postsCollection.findOne({ _id: res.insertedId })
    return insertedPosts as unknown as InsertedResult<PostModel>
  }

  const insertAccountsAndReturnResult = async (favouritesList?: ObjectId[]): Promise<Array<InsertedResult<AccountModel>>> => {
    await accountsCollection.insertMany([
      { ...mockAccountRepositoryParams()[0], favouritesList },
      { ...mockAccountRepositoryParams()[1], favouritesList }
    ])

    const insertedAccounts = await accountsCollection.find().toArray()
    return insertedAccounts as unknown as Array<InsertedResult<AccountModel>>
  }

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  describe('add()', () => {
    test('Should return true success', async () => {
      const sut = makeSut()
      const result = await sut.addAccount({ ...mockAccountRepositoryParams()[0] })
      expect(result).toBe(true)
      // eu espero que tenha retornado algum valor do "add"
      // expect(account.id).toBeTruthy() // espero que a account tenha algum id
      // expect(account.name).toBe('any_name')
      // expect(account.email).toBe('any_email@mail.com')
      // expect(account.password).toBe('789456123')
      // expect(account.doc).toBe('58978963252')
      // expect(account.birthDate).toBe('05/10/1970')
      // expect(account.phone).toBe('5563982266580')
      // expect(account.profiles).toBe('admin')
    })
  })

  describe('loadAll()', () => {
    test('Should return an account array on loadAccouts success', async () => {
      const sut = makeSut()
      const insertedPost = await insertPostAndReturnResult()
      await insertAccountsAndReturnResult([insertedPost._id])

      const accounts = await sut.loadAll()
      expect(accounts).toBeTruthy()
      expect(accounts.length).toBe(2)
      expect(accounts[0].id).toBeTruthy()
      expect(accounts[0].name).toBe('any_name')
      expect(accounts[0].email).toBe('any_email@mail.com')
      expect(accounts[1].favouritesList[0].id).toBeTruthy()
    })

    test('Should return null if loadByEmail fails', async () => {
      const sut = makeSut()
      const account = await sut.loadAll()
      expect(account).toEqual([])
    })
  })

  describe('loadById()', () => {
    test('Should return with lookup on favouritesList with this field isnt empty', async () => {
      const sut = makeSut()
      const insertedPost = await insertPostAndReturnResult()
      const insertedAccounts = await insertAccountsAndReturnResult([insertedPost._id])
      const account = await sut.loadById({ id: String(insertedAccounts[0]._id) })
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.favouritesList[0].id).toBeTruthy()
    })
    test('Should return an account on loadById success', async () => {
      const sut = makeSut()
      const insertedAccounts = await insertAccountsAndReturnResult()

      const account = await sut.loadById({ id: String(insertedAccounts[0]._id) })
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
    })
  })

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut()
      const insertedAccounts = await insertAccountsAndReturnResult()
      const account = await sut.loadByEmail({ email: insertedAccounts[0].email })
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
    })

    test('Should return null if loadByEmail fails', async () => {
      // não criei uma fake account, induzindo o método a falhar
      const sut = makeSut()
      const account = await sut.loadByEmail({ email: 'any_email@mail.com' })
      expect(account).toBeFalsy()
    })
  })

  describe('loadByCode()', () => {
    test('Should return an account on loadByCode success', async () => {
      const sut = makeSut()
      const code = mockAccountConfirmationCode()
      await accountsCollection.insertOne({
        ...mockAccountParams(),
        code
      })
      const account = await sut.loadByCode({ code: code.number })
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
    })

    test('Should return null if loadByCode fails', async () => {
      // não criei uma fake account, induzindo o método a falhar
      const sut = makeSut()
      const account = await sut.loadByEmail({ email: 'any_email@mail.com' })
      expect(account).toBeFalsy()
    })
  })

  describe('loadByToken()', () => {
    test('Should return an account on loadByToken success without profiles', async () => {
      const sut = makeSut()

      await accountsCollection.insertOne({
        ...mockAccountParams(),
        accessToken: 'any_access_token'
      })

      const account = await sut.loadByToken({ accessToken: 'any_access_token' })
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
    })

    test('Should return an account on loadByToken success with admin profiles', async () => {
      const sut = makeSut()

      await accountsCollection.insertOne({
        ...mockAccountParams(),
        profiles: ['admin', 'queijo'],
        accessToken: 'any_access_token'
      })

      const account = await sut.loadByToken({ accessToken: 'any_access_token', profiles: ['admin'] })
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
    })

    test('Should return null on loadByToken if it was loaded with a profiles that doesnt belongs to its account', async () => {
      const sut = makeSut()

      await accountsCollection.insertOne({
        ...mockAccountParams(),
        accessToken: 'any_access_token'
      })

      const account = await sut.loadByToken({ accessToken: 'any_access_token', profiles: ['admin', 'girafakkkk'] })
      expect(account).toBeFalsy()
    })

    test('Should return an account on loadByToken success if user is admin', async () => {
      const sut = makeSut()

      await accountsCollection.insertOne({
        ...mockAccountParams(),
        accessToken: 'any_access_token'
      })

      const account = await sut.loadByToken({ accessToken: 'any_access_token' })
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
    })

    test('Should return null if loadByToken fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken({ accessToken: 'any_access_token', profiles: ['admin'] })
      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut()
      const insertedAccounts = await insertAccountsAndReturnResult()
      expect(insertedAccounts[0].accessToken).toBeFalsy() // espero que primeiro não tenha accessToken

      await sut.updateAccessToken({ id: String(insertedAccounts[0]._id), accessToken: 'any_access_token' })
      const account = await accountsCollection.findOne({ _id: insertedAccounts[0]._id })
      expect(account._id).toBeTruthy()
      expect(account.accessToken).toBe('any_access_token')
    })
  })

  describe('updateAccount()', () => {
    test('Should update the account fields on updateAccount success', async () => {
      const sut = makeSut()
      const insertedAccounts = await insertAccountsAndReturnResult()
      const result = await sut.updateAccount({ id: String(insertedAccounts[0]._id), fields: { name: 'other_name', cep: 'other_cep' } })
      expect(result).toBe(true)

      const account = await accountsCollection.findOne({ _id: insertedAccounts[0]._id })
      expect(account).toBeTruthy()
      expect(account.name).toBe('other_name')
      expect(account.cep).toBe('other_cep')
    })
  })

  describe('addFavourite()', () => {
    test('Should not add duplicated itens', async () => {
      const sut = makeSut()
      const favouritePostId1 = new ObjectId()
      const insertedAccounts = await insertAccountsAndReturnResult([favouritePostId1])
      const result = await sut.addFavourite({ id: String(insertedAccounts[0]._id), favouritePostId: String(favouritePostId1) })
      expect(result).toBe(false)

      const account = await accountsCollection.findOne({ _id: insertedAccounts[0]._id })
      expect(account).toBeTruthy()
      expect(account.favouritesList).toEqual([favouritePostId1])
    })

    test('Should addFavourite on success', async () => {
      const sut = makeSut()
      const favouritePostId1 = new ObjectId()
      const favouritePostId2 = new ObjectId()
      const insertedAccounts = await insertAccountsAndReturnResult([favouritePostId1])
      const result = await sut.addFavourite({ id: String(insertedAccounts[0]._id), favouritePostId: String(favouritePostId2) })
      expect(result).toBe(true) // verify this

      const account = await accountsCollection.findOne({ _id: insertedAccounts[0]._id })
      expect(account).toBeTruthy()
      expect(account.favouritesList).toEqual([favouritePostId1, favouritePostId2])
    })
  })

  describe('removeFavourite()', () => {
    test('Should remove favouritePost from list givem the id', async () => {
      const sut = makeSut()
      const favouritePostId = new ObjectId()
      const insertedAccounts = await insertAccountsAndReturnResult([favouritePostId])
      const result = await sut.removeFavourite({ id: String(insertedAccounts[0]._id), favouritePostId: String(favouritePostId) })
      expect(result).toBe(true)

      const account = await accountsCollection.findOne({ _id: insertedAccounts[0]._id })
      expect(account).toBeTruthy()
      expect(account.favouritesList).toEqual([])
    })

    // test('Should update the account fields on updateAccount success', async () => {
    //   const sut = makeSut()

    //   const res = await accountsCollection.insertOne({
    //     ...mockAccountParams(), favouritePosts: ['any_favourite_post_1']
    //   })
    //   const fakeAccount = res.ops[0]
    //   const result = await sut.addFavourite({ id: fakeAccount._id, favouritePostId: 'any_favourite_post_2' })
    //   expect(result).toBe(true)
    //   const account = await accountsCollection.findOne({ _id: fakeAccount._id })
    //   expect(account).toBeTruthy()
    //   expect(account.favouritePosts).toEqual(['any_favourite_post_1', 'any_favourite_post_2'])
    // })
  })

  describe('updatePassword()', () => {
    test('Should update accounts password on updatePassword success', async () => {
      const sut = makeSut()
      const insertedAccounts = await insertAccountsAndReturnResult()
      const result = await sut.updatePassword({ id: String(insertedAccounts[0]._id), password: 'other_password' })
      expect(result).toBe(true)

      const account = await accountsCollection.findOne({ _id: insertedAccounts[0]._id })
      expect(account).toBeTruthy()
      expect(account.password !== insertedAccounts[0]._id).toBe(true)
    })
  })

  describe('deleteAccount', () => {
    test('Should return true on success', async () => {
      const sut = makeSut()

      const res = await accountsCollection.insertOne({
        ...mockAccountParams()
      })
      await insertPostAndReturnResult(res.insertedId)
      const id = { id: String(res.insertedId) }

      let posts = await postsCollection.find({ postedBy: res.insertedId }).toArray()
      expect(posts.length).toBe(1)

      const deletionResult = await sut.deleteAccount(id)
      expect(deletionResult).toBe(true)

      posts = await postsCollection.find({ postedBy: res.insertedId }).toArray()
      expect(posts.length).toBe(0)
    })
    test('Should return false if account doesnt exists', async () => {
      const sut = makeSut()
      const deletionResult = await sut.deleteAccount({ id: '61539180dd2622353d5e11c8' })
      expect(deletionResult).toBe(false)
    })
  })
})

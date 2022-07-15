import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient, // assim que fazemos para o typescript funcionar em objetos
  url: null as string,

  async connect (url: string): Promise<void> {
    this.url = url
    this.client = await MongoClient.connect(url, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true
    })
  },
  async disconnect (): Promise<void> {
    await this.client.close()
    this.cliente = null
  },
  async getCollection (name: string): Promise<Collection> {
    return await this.client.db().collection(name)
  },
  async setupIndexes (): Promise<void> {
    const postsCollection = await this.getCollection('posts')
    console.info('START INDEXES SETUP')
    console.info('[POSTS] CREATING INDEX - title and description')
    postsCollection.createIndex({ title: 'text', description: 'text' }, { default_language: 'pt' })
    console.info('FINISH INDEXES SETUP ')
  },
  map: (data: any): any => { // regra de negócio: o mongo retorna o id como _id, como preciso utilizar como id
    // console.log({ data })
    const { _id, ...collectionWithoutId } = data
    return Object.assign({}, collectionWithoutId, { id: _id })
  },
  mapCollection: (collection: any[]): any[] => {
    return collection.map(c => MongoHelper.map(c))
  }
}

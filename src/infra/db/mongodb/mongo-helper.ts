import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient, // assim que fazemos para o typescript funcionar em objetos
  url: null as string,

  async connect (url: string): Promise<void> {
    this.url = url
    this.client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },
  async disconnect (): Promise<void> {
    await this.client.close()
    this.cliente = null
  },
  async getCollection (name: string): Promise<Collection> {
    /** ?
     *  as vezes a conexão poderá ter sido encerrada,
     * então faremos o reconect para garantir que o usuário não receba um erro
     */
    if (!this.client.isConnected()) await this.connect(this.url)
    return this.client.db().collection(name)
  },
  async setupIndexes (): Promise<void> {
    const postsCollection = await this.getCollection('posts')
    console.info('START INDEXES SETUP')
    console.info('[POSTS] CREATING INDEX - title ')
    postsCollection.createIndex({ title: 'text' })
    console.info('[POSTS] FINISHED INDEX - title ')
  },
  map: (data: any): any => { // regra de negócio: o mongo retorna o id como _id, como preciso utilizar como id
    const { _id, ...collectionWithoutId } = data
    return Object.assign({}, collectionWithoutId, { id: _id })
  },
  mapCollection: (collection: any[]): any[] => {
    return collection.map(c => MongoHelper.map(c))
  }
}

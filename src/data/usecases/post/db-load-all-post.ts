import { LoadAllPosts } from '@/domain/usecases'
import { LoadAllPostsRepository } from '@/data/protocols'

export class DbLoadAllPosts implements LoadAllPosts {
  constructor (private readonly loadAllPostsRepository: LoadAllPostsRepository) { }

  async load (): LoadAllPosts.Result {
    const posts = await this.loadAllPostsRepository.loadAll()
    return posts
  }
}

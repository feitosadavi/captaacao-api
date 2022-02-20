import { LoadPostsRepository } from '@/data/protocols'
import { PostModel } from '@/domain/models'
import { LoadPosts } from '@/domain/usecases'

export class DbLoadPosts implements LoadPosts {
  constructor (private readonly loadPostsRepository: LoadPostsRepository) { }

  async load (): Promise<PostModel[]> {
    const posts = await this.loadPostsRepository.loadAll()
    return posts
  }
}

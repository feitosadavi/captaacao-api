import { AddPost } from '@/domain/usecases'
import { AddPostRepository } from '@/data/protocols'

export class DbAddPost implements AddPost {
  constructor (
    private readonly addPostRepository: AddPostRepository
  ) {}

  async add (params: AddPost.Params): AddPost.Result {
    await this.addPostRepository.addPost(params)
  }
}

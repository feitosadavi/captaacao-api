import { AddPostRepository } from '@/data/protocols'
import { AddPost } from '@/domain/usecases'

export class DbAddPost implements AddPost {
  constructor (
    private readonly addPostRepository: AddPostRepository
  ) {}

  async add (params: AddPost.Params): AddPost.Result {
    await this.addPostRepository.addPost(params)
  }
}

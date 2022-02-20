import { AddPostRepository } from '@/data/protocols'
import { AddPost, AddPostParams } from '@/domain/usecases'

export class DbAddPost implements AddPost {
  constructor (
    private readonly addPostRepository: AddPostRepository
  ) {}

  async add (data: AddPostParams): Promise<void> {
    await this.addPostRepository.add(data)
  }
}

import { DeletePost } from '@/domain/usecases'
import { DeletePostRepository } from '@/data/protocols'

export class DbDeletePost implements DeletePost {
  constructor (
    private readonly deletePostRepository: DeletePostRepository
  ) {}

  async delete (params: DeletePost.Params): DeletePost.Result {
    const result = await this.deletePostRepository.deletePost(params)
    return result
  }
}

import { LoadPostByIdRepository } from '@/data/protocols'
import { LoadPostById } from '@/domain/usecases'

export class DbLoadPostById implements LoadPostById {
  constructor (private readonly loadPostByIdRepository: LoadPostByIdRepository) { }

  async load (params: LoadPostById.Params): LoadPostById.Result {
    const post = await this.loadPostByIdRepository.loadById(params)
    return post
  }
}

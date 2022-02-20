import {
  AddPostRepository,
  LoadPostByIdRepository,
  LoadPostsRepository
} from '@/data/protocols'
import { PostModel } from '@/domain/models'
import { AddPostParams } from '@/domain/usecases'
import { mockPostsModel } from '@tests/domain/mocks'

export const mockAddPostRepository = (): AddPostRepository => {
  class AddPostRepositoryStub implements AddPostRepository {
    async add (data: AddPostParams): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddPostRepositoryStub()
}

export const mockLoadPostsRepository = (): LoadPostsRepository => {
  class LoadPostsRepositoryStub implements LoadPostsRepository {
    async loadAll (): Promise<PostModel[]> {
      return Promise.resolve(mockPostsModel())
    }
  }
  return new LoadPostsRepositoryStub()
}

export const mockLoadPostByIdRepository = (): LoadPostByIdRepository => {
  class LoadPostByIdRepositoryStub implements LoadPostByIdRepository {
    async loadById (id: string): Promise<PostModel> {
      return Promise.resolve(mockPostsModel()[0])
    }
  }
  return new LoadPostByIdRepositoryStub()
}

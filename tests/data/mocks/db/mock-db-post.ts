import {
  AddPostRepository,
  LoadPostByIdRepository,
  LoadAllPostsRepository
} from '@/data/protocols'
import { DeletePostRepository } from '@/data/protocols/db/post/delete-post-repository'
import { mockPostsModel } from '@tests/domain/mocks'

export const mockAddPostRepository = (): AddPostRepository => {
  class AddPostRepositoryStub implements AddPostRepository {
    async addPost (params: AddPostRepository.Params): AddPostRepository.Result {
      return Promise.resolve()
    }
  }
  return new AddPostRepositoryStub()
}

export const mockLoadAllPostsRepository = (): LoadAllPostsRepository => {
  class LoadAllPostsRepositoryStub implements LoadAllPostsRepository {
    async loadAll (): LoadAllPostsRepository.Result {
      return Promise.resolve(mockPostsModel())
    }
  }
  return new LoadAllPostsRepositoryStub()
}

export const mockLoadPostByIdRepository = (): LoadPostByIdRepository => {
  class LoadPostByIdRepositoryStub implements LoadPostByIdRepository {
    async loadById (params: LoadPostByIdRepository.Params): LoadPostByIdRepository.Result {
      return Promise.resolve(mockPostsModel()[0])
    }
  }
  return new LoadPostByIdRepositoryStub()
}

export const mockDeletePostRepository = (): DeletePostRepository => {
  class DeletePostRepositoryStub implements DeletePostRepository {
    async deletePost (params: DeletePostRepository.Params): DeletePostRepository.Result {
      return Promise.resolve(true)
    }
  }
  return new DeletePostRepositoryStub()
}

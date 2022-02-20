import { PostModel } from '@/domain/models'
import { AddPost, AddPostParams, LoadPostById, LoadPosts } from '@/domain/usecases'
import { mockPostsModel } from '@tests/domain/mocks'

export const mockAddPost = (): AddPost => {
  class AddPostStub implements AddPost {
    async add (data: AddPostParams): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddPostStub()
}

export const mockLoadPosts = (): LoadPosts => {
  class LoadPostsStub implements LoadPostsStub {
    async load (): Promise<PostModel[]> {
      return Promise.resolve(mockPostsModel())
    }
  }
  return new LoadPostsStub()
}

export const mockLoadPostById = (): LoadPostById => {
  class LoadPostByIdStub implements LoadPostByIdStub {
    async loadById (): Promise<PostModel> {
      return Promise.resolve(mockPostsModel()[0])
    }
  }
  return new LoadPostByIdStub()
}

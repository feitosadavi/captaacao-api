import { PostModel } from '@/domain/models'
import { AddPost, LoadPostById, LoadAllPosts, DeletePost, UpdatePost } from '@/domain/usecases'

import { mockPostsModel } from '@tests/domain/mocks'

export const mockAddPost = (): AddPost => {
  class AddPostStub implements AddPost {
    async add (params: AddPost.Params): AddPost.Result {
      return Promise.resolve()
    }
  }
  return new AddPostStub()
}

export const mockLoadAllPosts = (): LoadAllPosts => {
  class LoadAllPostsStub implements LoadAllPostsStub {
    async load (): Promise<LoadAllPosts.Result> {
      return Promise.resolve({ posts: mockPostsModel() })
    }
  }
  return new LoadAllPostsStub()
}

export const mockLoadPostById = (): LoadPostById => {
  class LoadPostByIdStub implements LoadPostByIdStub {
    async load (): Promise<PostModel> {
      return Promise.resolve(mockPostsModel()[0])
    }
  }
  return new LoadPostByIdStub()
}

export const mockUpdatePost = (): UpdatePost => {
  class UpdatePostStub implements UpdatePost {
    async update (): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new UpdatePostStub()
}

export const mockDeletePost = (): DeletePost => {
  class DeletePostStub implements DeletePost {
    async delete (): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new DeletePostStub()
}

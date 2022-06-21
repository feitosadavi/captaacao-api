import {
  AddPostRepository,
  LoadPostByIdRepository,
  LoadAllPostsRepository,
  UpdatePostRepository
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
    async loadAll (): Promise<LoadAllPostsRepository.Result> {
      return Promise.resolve({ result: mockPostsModel() })
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

export const mockUpdatePostRepository = (): UpdatePostRepository => {
  class UpdatePostRepositoryStub implements UpdatePostRepository {
    async updatePost (params: UpdatePostRepository.Params): UpdatePostRepository.Result {
      return Promise.resolve(true)
    }
  }
  return new UpdatePostRepositoryStub()
}

export const mockDeletePostRepository = (): DeletePostRepository => {
  class DeletePostRepositoryStub implements DeletePostRepository {
    async deletePost (params: DeletePostRepository.Params): DeletePostRepository.Result {
      return Promise.resolve(true)
    }
  }
  return new DeletePostRepositoryStub()
}

export const mockPostsRepositoryParams = (): AddPostRepository.Params[] => {
  return [{
    title: 'any_title',
    description: 'any_description',
    photos: ['any_file_1_name', 'any_file_2_name'],
    createdAt: new Date(),
    modifiedAt: new Date(),
    postedBy: 'any_account_id',
    status: true,
    active: true,
    views: 0,
    carBeingSold: {
      price: 999999,
      fipePrice: 111111,
      brand: 'any_brand',
      model: 'any_model',
      year: 'any_year',
      color: 'any_color',
      doors: 4,
      steering: 'any_steering',
      fuel: 'any_fuel',
      kmTraveled: 100000,
      carItems: [
        'airbag',
        'alarme',
        'ar quente',
        'teto solar'
      ],
      licensePlate: 'any_license',
      sold: false,
      fastSale: true
    }
  },
  {
    title: 'other_title',
    description: 'other_description',
    photos: ['any_file1_name', 'any_file2_name'],
    createdAt: new Date(),
    modifiedAt: new Date(),
    postedBy: 'other_account_id',
    status: true,
    active: true,
    views: 0,
    carBeingSold: {
      price: 999999,
      fipePrice: 111111,
      brand: 'other_brand',
      model: 'other_model',
      year: 'other_year',
      color: 'other_color',
      doors: 4,
      steering: 'other_steering',
      fuel: 'other_fuel',
      kmTraveled: 100000,
      carItems: [
        'airbag',
        'alarme',
        'ar quente',
        'teto solar'
      ],
      licensePlate: 'other_license',
      sold: false,
      fastSale: true
    }
  }]
}

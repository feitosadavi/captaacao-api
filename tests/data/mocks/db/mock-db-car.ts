import { AddCarRepository } from '@/data/protocols/db/car/add-car-repository'
import { LoadCarByIdRepository } from '@/data/protocols/db/car/load-car-by-id-repository'
import { LoadCarsRepository } from '@/data/protocols/db/car/load-car-repository'
import { CarModel } from '@/domain/models'
import { AddCarParams } from '@/domain/usecases'
import { mockCarsModel } from '@tests/domain/mocks'

export const mockAddCarRepository = (): AddCarRepository => {
  class AddCarRepositoryStub implements AddCarRepository {
    async add (data: AddCarParams): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddCarRepositoryStub()
}

export const mockLoadCarsRepository = (): LoadCarsRepository => {
  class LoadCarsRepositoryStub implements LoadCarsRepository {
    async loadAll (): Promise<CarModel[]> {
      return Promise.resolve(mockCarsModel())
    }
  }
  return new LoadCarsRepositoryStub()
}

export const mockLoadCarByIdRepository = (): LoadCarByIdRepository => {
  class LoadCarByIdRepositoryStub implements LoadCarByIdRepository {
    async loadById (id: string): Promise<CarModel> {
      return Promise.resolve(mockCarsModel()[0])
    }
  }
  return new LoadCarByIdRepositoryStub()
}

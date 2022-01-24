import { CarModel } from '@/domain/models'
import { AddCar, AddCarParams, LoadCarById, LoadCars } from '@/domain/usecases'
import { mockCarsModel } from '@tests/domain/mocks'

export const mockAddCar = (): AddCar => {
  class AddCarStub implements AddCar {
    async add (data: AddCarParams): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddCarStub()
}

export const mockLoadCars = (): LoadCars => {
  class LoadCarsStub implements LoadCarsStub {
    async load (): Promise<CarModel[]> {
      return Promise.resolve(mockCarsModel())
    }
  }
  return new LoadCarsStub()
}

export const mockLoadCarById = (): LoadCarById => {
  class LoadCarByIdStub implements LoadCarByIdStub {
    async loadById (): Promise<CarModel> {
      return Promise.resolve(mockCarsModel()[0])
    }
  }
  return new LoadCarByIdStub()
}

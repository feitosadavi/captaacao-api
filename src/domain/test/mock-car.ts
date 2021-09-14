import { LoadCarById } from '@/presentation/controllers/car/load-car-by-id/load-car-by-id-protocols'
import { CarModel } from '../models/car'
import { AddCar, AddCarParams } from '../usecases/car/add-car'
import { LoadCars } from '../usecases/car/load-cars'

export const mockCarsModel = (): CarModel[] => {
  return [{
    id: 'any_id',
    name: 'any_name',
    price: 100000,
    brand: 'any_brand',
    year: 'any_year',
    color: 'any_color',
    kmTraveled: 100000,
    addDate: new Date(),
    vehicleItems: [
      'airbag',
      'alarme',
      'ar quente',
      'teto solar'
    ] // airbag, alarme, etc
  },
  {
    id: 'other_id',
    name: 'other_name',
    price: 100000,
    brand: 'other_brand',
    year: 'other_year',
    color: 'other_color',
    kmTraveled: 100000,
    addDate: new Date(),
    vehicleItems: [
      'airbag',
      'alarme',
      'ar quente',
      'teto solar'
    ] // airbag, alarme, etc
  }
  ]
}

export const mockCarsParams = (): AddCarParams[] => {
  return [{
    name: 'any_name',
    price: 100000,
    brand: 'any_brand',
    year: 'any_year',
    color: 'any_color',
    kmTraveled: 100000,
    addDate: new Date(),
    vehicleItems: [
      'airbag',
      'alarme',
      'ar quente',
      'teto solar'
    ]
  },
  {
    name: 'other_name',
    price: 100000,
    brand: 'other_brand',
    year: 'other_year',
    color: 'other_color',
    kmTraveled: 100000,
    addDate: new Date(),
    vehicleItems: [
      'airbag',
      'alarme',
      'ar quente',
      'teto solar'
    ] // airbag, alarme, etc
  }
  ]
}

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

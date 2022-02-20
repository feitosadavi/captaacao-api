import { CarModel } from '../models/post'
import { AddCarParams } from '@/domain/usecases'

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

import { AddCarRepository } from '@/data/protocols/db/car/add-car-repository'
import { LoadCarByIdRepository } from '@/data/protocols/db/car/load-car-by-id-repository'
import { LoadCarsRepository } from '@/data/protocols/db/car/load-car-repository'
import { CarModel } from '@/domain/models/car'
import { AddCarParams } from '@/domain/usecases/car/add-car'
import { ObjectID } from 'mongodb'
import { MongoHelper } from './mongo-helper'

export class CarMongoRepository implements AddCarRepository, LoadCarsRepository, LoadCarByIdRepository {
  async add (carData: AddCarParams): Promise<void> {
    const carsCollection = await MongoHelper.getCollection('cars')
    await carsCollection.insertOne(carData)
  }

  async loadAll (): Promise<CarModel[]> {
    const carsCollection = await MongoHelper.getCollection('cars')
    const cars = await carsCollection.find().toArray()
    return cars && MongoHelper.mapCollection(cars)
  }

  async loadById (id: string): Promise<CarModel> {
    const carsCollection = await MongoHelper.getCollection('cars')
    const car = await carsCollection.findOne({ _id: new ObjectID(id) })
    return car && MongoHelper.map(car)
  }
}

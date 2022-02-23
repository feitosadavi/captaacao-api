import { PostModel } from '@/domain/models'
import { AddPost } from '@/domain/usecases'

export const mockPostsModel = (): PostModel[] => {
  return [{
    id: 'any_id',
    title: 'any_title',
    description: 'any_description',
    photos: ['any_photo_link.com', 'other_photo_link.com'],
    createdAt: new Date(),
    modifiedAt: new Date(),
    postedBy: 'any_account_id',
    status: true,
    views: 0,
    carBeingSold: {
      price: 999999,
      thumb: 'any_thumb_link.com',
      fipePrice: 111111,
      brand: 'any_brand',
      model: 'any_model',
      year: 'any_year',
      color: 'any_color',
      doors: 4,
      steering: 'any_steering',
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
    id: 'other_id',
    title: 'other_title',
    description: 'other_description',
    photos: ['other_photo_link.com', 'other_photo_link.com'],
    createdAt: new Date(),
    modifiedAt: new Date(),
    postedBy: 'other_account_id',
    status: true,
    views: 0,
    carBeingSold: {
      price: 999999,
      thumb: 'other_thumb_link.com',
      fipePrice: 111111,
      brand: 'other_brand',
      model: 'other_model',
      year: 'other_year',
      color: 'other_color',
      doors: 4,
      steering: 'other_steering',
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

export const mockPostsParams = (): AddPost.Params[] => {
  return [{
    title: 'any_title',
    description: 'any_description',
    photos: ['any_photo_link.com', 'other_photo_link.com'],
    createdAt: new Date(),
    modifiedAt: new Date(),
    postedBy: 'any_account_id',
    status: true,
    views: 0,
    carBeingSold: {
      price: 999999,
      thumb: 'any_thumb_link.com',
      fipePrice: 111111,
      brand: 'any_brand',
      model: 'any_model',
      year: 'any_year',
      color: 'any_color',
      doors: 4,
      steering: 'any_steering',
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
    photos: ['other_photo_link.com', 'other_photo_link.com'],
    createdAt: new Date(),
    modifiedAt: new Date(),
    postedBy: 'other_account_id',
    status: true,
    views: 0,
    carBeingSold: {
      price: 999999,
      thumb: 'other_thumb_link.com',
      fipePrice: 111111,
      brand: 'other_brand',
      model: 'other_model',
      year: 'other_year',
      color: 'other_color',
      doors: 4,
      steering: 'other_steering',
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

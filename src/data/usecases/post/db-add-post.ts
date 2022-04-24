import { AddPost } from '@/domain/usecases'
import { AddPostRepository, UploadManyFiles } from '@/data/protocols'

export class DbAddPost implements AddPost {
  constructor (
    private readonly addPostRepository: AddPostRepository,
    private readonly uploadFile: UploadManyFiles
  ) {}

  async add (params: AddPost.Params): AddPost.Result {
    const photos = params.photos.map(p => ({ file: p.buffer, fileName: p.fileName }))
    await this.uploadFile.uploadMany(photos)
    const photosFileName = params.photos.map(p => p.fileName)
    await this.addPostRepository.addPost({ ...params, photos: photosFileName })
  }
}

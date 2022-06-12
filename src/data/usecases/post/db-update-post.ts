import { UpdatePost } from '@/domain/usecases'
import { DeleteManyFiles, LoadPostByIdRepository, UpdatePostRepository, UploadManyFiles } from '@/data/protocols'

export class DbUpdatePost implements UpdatePost {
  // eslint-disable-next-line space-before-function-paren
  constructor(
    private readonly updatePostRepository: UpdatePostRepository,
    private readonly loadPostByIdRepository: LoadPostByIdRepository,
    private readonly deleteManyFiles: DeleteManyFiles,
    private readonly uploadManyFiles: UploadManyFiles
  ) { }

  async update (params: UpdatePost.Params): UpdatePost.Result {
    const post = await this.loadPostByIdRepository.loadById({ id: params.id })
    let result = false
    if (post?.id) {
      const fieldsToUpdate = { ...params }

      if (params.fields.photos) {
        await this.deleteManyFiles.deleteMany({ filesNames: post.photos })
        const remote: Array<{ file: Buffer, fileName: string }> = []
        const local: string[] = []
        params.fields.photos.forEach((p: any) => {
          remote.push({ file: p.buffer, fileName: p.fileName })
          local.push(p.fileName)
        })
        await this.uploadManyFiles.uploadMany(remote)
        fieldsToUpdate.fields.photos = local
      }

      result = await this.updatePostRepository.updatePost(fieldsToUpdate)
    }
    return result
  }
}

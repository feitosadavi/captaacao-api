import { DeleteManyFiles, UploadFile, UploadManyFiles } from '@/data/protocols'

export const mockUploadFileStub = (): UploadFile => {
  class UploadFileStub implements UploadFile {
    async upload (input: UploadFile.Input): Promise<UploadFile.Output> {
      return Promise.resolve('any_file_link')
    }
  }
  return new UploadFileStub()
}

export const mockUploadManyFilesStub = (): UploadManyFiles => {
  class UploadManyFilesStub implements UploadManyFiles {
    async uploadMany (input: UploadManyFiles.Input): Promise<UploadManyFiles.Output> {
      return Promise.resolve(['any_file_1_link', 'any_file_2_link'])
    }
  }
  return new UploadManyFilesStub()
}

export const mockDeleteManyFilesStub = (): DeleteManyFiles => {
  class DeleteManyFilesStub implements DeleteManyFiles {
    async deleteMany (input: DeleteManyFiles.Input): Promise<void> {
      return await null
    }
  }
  return new DeleteManyFilesStub()
}

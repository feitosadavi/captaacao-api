import { UploadFile } from '@/data/protocols'

export const mockUploadFileStub = (): UploadFile => {
  class UploadFileStub implements UploadFile {
    async upload (input: UploadFile.Input): Promise<UploadFile.Output> {
      return Promise.resolve('any_file_link')
    }
  }
  return new UploadFileStub()
}

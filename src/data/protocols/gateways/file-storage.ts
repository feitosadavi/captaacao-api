export interface UploadFile {
  upload: (input: UploadFile.Input) => Promise<UploadFile.Output>
}

export namespace UploadFile {
  export type Input = { file: Buffer, fileName: string }
  export type Output = string
}

export interface UploadManyFiles {
  uploadMany: (input: UploadManyFiles.Input) => Promise<UploadManyFiles.Output>
}

export namespace UploadManyFiles {
  export type Input = Array<{ file: Buffer, fileName: string }>
  export type Output = string[]
}

export interface DeleteFile {
  delete: (input: DeleteFile.Input) => Promise<void>
}

export namespace DeleteFile {
  export type Input = { fileName: string }
}

export interface DeleteManyFiles {
  deleteMany: (input: DeleteManyFiles.Input) => Promise<void>
}

export namespace DeleteManyFiles {
  export type Input = { filesNames: string[] }
}

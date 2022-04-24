
import { DeleteFile, DeleteManyFiles, UploadFile, UploadManyFiles } from '@/data/protocols/gateways'
import { config, S3 } from 'aws-sdk'

export class AwsS3FileStorage implements UploadFile, UploadManyFiles, DeleteFile, DeleteManyFiles {
  // eslint-disable-next-line space-before-function-paren
  constructor(accessKey: string, secret: string, private readonly bucket: string) {
    config.update({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret
      }
    })
  }

  async upload ({ fileName, file }: UploadFile.Input): Promise<UploadFile.Output> {
    await new S3().putObject({
      Bucket: this.bucket,
      Key: fileName,
      Body: file,
      ACL: 'public-read'
    }).promise()
    return `https://${this.bucket}.s3.amazonaws.com/${encodeURIComponent(fileName)}`
  }

  // eslint-disable-next-line @typescript-eslint/array-type
  async uploadMany (input: UploadManyFiles.Input): Promise<UploadManyFiles.Output> {
    const urls: string[] = []
    for (const fileData of input) {
      await new S3().putObject({
        Bucket: this.bucket,
        Key: fileData.fileName,
        Body: fileData.file,
        ACL: 'public-read'
      }).promise()
      urls.push(`https://${this.bucket}.s3.amazonaws.com/${encodeURIComponent(fileData.fileName)}`)
    }
    return urls
  }

  async deleteMany ({ filesNames }: DeleteManyFiles.Input): Promise<void> {
    for (const fileName of filesNames) {
      await new S3().deleteObject({
        Bucket: this.bucket,
        Key: fileName
      }).promise()
    }
  }

  async delete ({ fileName }: DeleteFile.Input): Promise<void> {
    await new S3().deleteObject({
      Bucket: this.bucket,
      Key: fileName
    }).promise()
  }
}

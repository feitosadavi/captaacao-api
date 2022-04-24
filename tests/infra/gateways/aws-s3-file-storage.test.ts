
import env from '@/main/config/env'
import { AwsS3FileStorage } from '@/infra/gateways'

import axios from 'axios'
import { UploadManyFiles } from '@/data/protocols'

describe('Aws S3 Integration Tests', () => {
  let sut: AwsS3FileStorage
  beforeAll(() => {
    jest.setTimeout(20000)
  })
  beforeEach(() => {
    sut = new AwsS3FileStorage(
      env.s3.accessKey,
      env.s3.secret,
      env.s3.bucket
    )
  })

  test('should upload and delete image from aws s3', async () => {
    const onePixelImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+M/A8B8ABQAB/6Zcm10AAAAASUVORK5CYII='
    const file = Buffer.from(onePixelImage, 'base64')
    const fileName = 'any_file_name.png'

    const pictureUrl = await sut.upload({ fileName, file })
    expect((await axios.get(pictureUrl)).status).toBe(200)

    await sut.delete({ fileName })

    await expect(axios.get(pictureUrl)).rejects.toThrow()
  })

  test('should upload and delete many images from aws s3', async () => {
    const onePixelImage1 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+M/A8B8ABQAB/6Zcm10AAAAASUVORK5CYII='
    const onePixelImage2 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+M/A8B8ABQAB/6Zcm10AAAAASUVORK5CYII='

    const images: UploadManyFiles.Input = [{
      file: Buffer.from(onePixelImage1, 'base64'),
      fileName: 'any_file_1_name.png'
    }, {
      file: Buffer.from(onePixelImage2, 'base64'),
      fileName: 'any_file_2_name.png'
    }]

    const pictureUrl = await sut.uploadMany(images)
    expect((await axios.get(pictureUrl[0])).status).toBe(200)
    expect((await axios.get(pictureUrl[1])).status).toBe(200)

    const filesNames = images.map(image => image.fileName)
    await sut.deleteMany({ filesNames })

    await expect(axios.get(pictureUrl[0])).rejects.toThrow()
    await expect(axios.get(pictureUrl[1])).rejects.toThrow()
  })
})

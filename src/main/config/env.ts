export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://localhost:27017/captacao-db',
  port: process.env.PORT ?? 7000,
  secret: process.env.SECRET ?? 'secret',
  apiUrl: process.env.API_URL ?? 'http://localhost:',
  isProd: process.env.NODE_ENV === 'production',
  recEmail: process.env.REC_EMAIL ?? 'captacaodevtesting@gmail.com',
  recEmailPassword: process.env.REC_EMAIL_PASSWORD ?? '6dL5DFV3ePmspXS',

  testingEmail1: process.env.TESTING_EMAIL1 ?? 'captacaodevtesting@gmail.com',
  testingEmailPassword1: process.env.TESTING_EMAIL1_PASSWORD ?? '6dL5DFV3ePmspXS',
  testingEmail2: process.env.TESTING_EMAIL2 ?? 'captacaodevtesting2@gmail.com',
  testingEmailPassword2: process.env.TESTING_EMAIL2_PASSWORD ?? 'YNyKS<bP2!UVn>$&-63R{QUD6mj38HZe#-Pc9QRh};4c6q9K*t',

  s3: {
    accessKey: process.env.AWS_S3_ACCESS_KEY ?? ' AKIAUF6U4KOKL4LHPEME ',
    secret: process.env.AWS_S3_SECRET ?? '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',
    bucket: process.env.AWS_S3_BUCKET ?? 'captacao-images'
  }
}

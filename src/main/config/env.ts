export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/captaacao-api',
  port: process.env.PORT || 5050,
  secret: process.env.SECRET || 'secret',

  email: process.env.REC_EMAIL || 'captacaodevtesting@gmail.com',
  emailPassword: process.env.REC_EMAIL_PASSWORD || '6dL5DFV3ePmspXS',

  testingEmail1: process.env.TESTING_EMAIL1 || 'captacaodevtesting@gmail.com',
  testingEmailPassword1: process.env.TESTING_EMAIL1_PASSWORD || '6dL5DFV3ePmspXS',
  testingEmail2: process.env.TESTING_EMAIL2 || 'captacaodevtesting2@gmail.com',
  testingEmailPassword2: process.env.TESTING_EMAIL2_PASSWORD || 'YNyKS<bP2!UVn>$&-63R{QUD6mj38HZe#-Pc9QRh};4c6q9K*t'
}

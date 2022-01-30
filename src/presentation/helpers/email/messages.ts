import { SendEmail } from '@/data/protocols'

export const makePasswordRecoverMail = (from: string, to: string, recoverCode: number): SendEmail.Params => ({
  from,
  to,
  subject: 'Redefinição de senha',
  text: `Aqui está o seu código de redefinição de senha: ${recoverCode}`
  // html?: string
})

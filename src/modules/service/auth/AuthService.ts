import { useConfig } from '../../../config'
import {IHttpHeadersCarrier} from '../../../types/rest'

export class AuthService {
  private readonly botToken: string

  constructor(botToken: string | null = null){
    this.botToken = botToken ? botToken : useConfig().auth.token
  }

  authByToken(token: string = ''): boolean {
    if (!useConfig().auth.required) return true
    return this.botToken === token
  }

  authByRequest(request: IHttpHeadersCarrier): boolean {
    const token = request.headers.authorization?.replace('Bearer ', '')
    return this.authByToken(token || '')
  }
}

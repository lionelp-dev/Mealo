import env from '#start/env'
import { timingSafeEqual } from 'node:crypto'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class ServiceTokenMiddleware {
  async handle({ request, response }: HttpContext, next: NextFn) {
    const expectedToken = env.get('SERVICE_TOKEN')

    if (!expectedToken) {
      return response.status(500).send({
        detail: 'SERVICE_TOKEN must be configured',
      })
    }

    const token = request.header('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1]

    if (!token || !this.matches(token, expectedToken)) {
      response.header('WWW-Authenticate', 'Bearer')

      return response.status(401).send({
        detail: 'Invalid service token',
      })
    }

    return next()
  }

  private matches(actual: string, expected: string) {
    const actualBuffer = Buffer.from(actual)
    const expectedBuffer = Buffer.from(expected)

    if (actualBuffer.length !== expectedBuffer.length) {
      return false
    }

    return timingSafeEqual(actualBuffer, expectedBuffer)
  }
}

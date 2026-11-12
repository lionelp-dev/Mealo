import env from '#start/env'
import logger from '@adonisjs/core/services/logger'

interface OpenRouterImageResponse {
  data?: { b64_json?: string }[]
}

type RecipeImageGenerationOptions = {
  timeoutMs?: number
}

export class RecipeImageClient {
  static readonly DEFAULT_BASE_URL = 'https://openrouter.ai/api/v1'
  static readonly DEFAULT_IMAGE_MODEL = 'openai/gpt-image-2'

  static readonly IMAGE_OPTIONS = {
    size: '1024x640',
    quality: 'low',
    output_format: 'jpeg',
    output_compression: 75,
  } as const

  private readonly baseUrl = env.get('OPENROUTER_BASE_URL', RecipeImageClient.DEFAULT_BASE_URL)
  private readonly model = env.get('OPENROUTER_IMAGE_MODEL', RecipeImageClient.DEFAULT_IMAGE_MODEL)
  private readonly apiKey = env.get('OPENROUTER_API_KEY')

  private instructions(name: string): string {
    return (
      `A professional food photography of ${name}, appetizing presentation, ` +
      'high quality, well-lit, centered on a clean white plate, neutral background, ' +
      'culinary magazine style, realistic, detailed, ' +
      'no text, no typography, no letters, no words, no labels, no logos, no watermark'
    )
  }

  async generateDataUrl(
    name: string,
    { timeoutMs }: RecipeImageGenerationOptions = {}
  ): Promise<string | null> {
    if (!this.apiKey) {
      logger.warn(
        { recipeName: name },
        'Recipe image generation skipped: OpenRouter API key is missing'
      )
      return null
    }

    const startedAt = performance.now()
    const context = { recipeName: name, model: this.model }
    const logContext = (extra: Record<string, unknown> = {}) => ({
      ...context,
      ...extra,
      durationMs: Math.round(performance.now() - startedAt),
    })
    const signal = timeoutMs === undefined ? undefined : AbortSignal.timeout(timeoutMs)

    logger.info(context, 'Recipe image generation started')

    try {
      const response = await fetch(`${this.baseUrl}/images/generations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        signal,
        body: JSON.stringify({
          model: this.model,
          prompt: this.instructions(name),
          n: 1,
          ...RecipeImageClient.IMAGE_OPTIONS,
        }),
      })

      if (!response.ok) {
        logger.warn(
          logContext({ status: response.status }),
          'Recipe image generation failed'
        )
        return null
      }

      const json = (await response.json()) as OpenRouterImageResponse
      const b64Json = json.data?.[0]?.b64_json

      if (!b64Json) {
        logger.warn(
          logContext({ status: response.status }),
          'Recipe image generation returned no image data'
        )
        return null
      }

      logger.info(
        logContext({ status: response.status }),
        'Recipe image generation completed'
      )

      return `data:image/${RecipeImageClient.IMAGE_OPTIONS.output_format};base64,${b64Json}`
    } catch (error) {
      const timedOut = signal?.aborted

      logger.warn(
        logContext(timedOut ? { timeoutMs } : { err: error }),
        timedOut
          ? 'Recipe image generation timed out'
          : 'Recipe image generation request errored'
      )
      return null
    }
  }
}

import env from '#start/env'

interface OpenRouterImageResponse {
  data?: { b64_json?: string }[]
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

  async generateDataUrl(name: string): Promise<string | null> {
    if (!this.apiKey) {
      return null
    }

    try {
      const response = await fetch(`${this.baseUrl}/images/generations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: this.instructions(name),
          n: 1,
          ...RecipeImageClient.IMAGE_OPTIONS,
        }),
      })

      if (!response.ok) {
        return null
      }

      const json = (await response.json()) as OpenRouterImageResponse
      const image = json.data?.[0]

      if (!image?.b64_json) {
        return null
      }

      return `data:image/${RecipeImageClient.IMAGE_OPTIONS.output_format};base64,${image.b64_json}`
    } catch {
      return null
    }
  }
}

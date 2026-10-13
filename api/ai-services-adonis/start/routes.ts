import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const RecipeGenerationController = () => import('#controllers/recipe_generation_controller')
const RecipeDiscoveryController = () => import('#controllers/recipe_discovery_controller')

router.get('/health', () => {
  return { status: 'ok' }
})

router
  .group(() => {
    router.get('/internal/ping', () => {
      return {
        status: 'ok',
        message: 'Authenticated request',
      }
    })
    router.post('/internal/recipes/generate', [RecipeGenerationController, 'generate'])
    router.post('/internal/recipes/discover', [RecipeDiscoveryController, 'discover'])
  })
  .use(middleware.serviceToken())

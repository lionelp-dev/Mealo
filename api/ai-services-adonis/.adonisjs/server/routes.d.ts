import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'recipe_generation.generate': { paramsTuple?: []; params?: {} }
    'recipe_discovery.discover': { paramsTuple?: []; params?: {} }
  }
  GET: {
  }
  HEAD: {
  }
  POST: {
    'recipe_generation.generate': { paramsTuple?: []; params?: {} }
    'recipe_discovery.discover': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}
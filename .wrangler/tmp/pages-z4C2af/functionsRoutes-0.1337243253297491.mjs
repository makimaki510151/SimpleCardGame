import { onRequestOptions as __api_skyway_token_js_onRequestOptions } from "C:\\Users\\shota\\oasobi\\Webゲーム\\SimpleCardGame\\functions\\api\\skyway-token.js"
import { onRequestPost as __api_skyway_token_js_onRequestPost } from "C:\\Users\\shota\\oasobi\\Webゲーム\\SimpleCardGame\\functions\\api\\skyway-token.js"

export const routes = [
    {
      routePath: "/api/skyway-token",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_skyway_token_js_onRequestOptions],
    },
  {
      routePath: "/api/skyway-token",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_skyway_token_js_onRequestPost],
    },
  ]
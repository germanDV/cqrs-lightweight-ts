import {OpenAPIHono} from "@hono/zod-openapi";
import AppContext from "../../config/app_context.js";
import Logger from "../../infrastructure/logging/logger.ts";

type Dependencies = {
    logger: Logger
}

export function injectDependencies(app: OpenAPIHono<AppContext>, dependencies: Dependencies) {
    app.use('*', async (c, next) => {
        c.set('logger', dependencies.logger)
        await next()
    })
}
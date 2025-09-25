import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { serve } from '@hono/node-server'
import pino from 'pino'
import { Scalar } from '@scalar/hono-api-reference'
import AppContext from "./context.ts"
import { healthcheckRoute, HealthStatus } from "./healthcheck.ts";
import AuthorsRestController from "./authors_rest_controller.ts";
import {AuthorsService} from "./authors_service.ts";

const app = new OpenAPIHono<AppContext>()

const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  base: undefined, // remove pid, hostname for cleaner logs in containers
})

const authorsService = new AuthorsService(logger)

// Middleware to inject dependencies.
app.use('*', async (c, next) => {
  c.set('logger', logger)
  c.set('authorsService', authorsService)
  await next()
})

app.get("/scalar", Scalar((c) => ({
  url: "/openapi.json",
  pageTitle: "Collateral API Client"
})))

app.doc('/openapi.json', {
  openapi: '3.1.0',
  info: {
    title: 'Collateral Arrangements SAPI',
    version: '0.1.0',
    description: 'Collateral Arrangements Standard API',
  },
})

app.openapi(healthcheckRoute, (c) => {
  return c.json({ status: HealthStatus.OK }, 200)
})

app.route("/authors", AuthorsRestController)

const port = Number(process.env.PORT ?? 3000)

serve({ fetch: app.fetch, port, hostname: '0.0.0.0' })

logger.info({ port }, `Server started on http://localhost:${port}`)

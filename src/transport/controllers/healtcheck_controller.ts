import { createRoute, z } from "@hono/zod-openapi";

export enum HealthStatus {
    OK = "OK",
    KO = "KO",
}

const HealthcheckResponse = z
    .object({ status: z.nativeEnum(HealthStatus) })
    .openapi({ example: { status: HealthStatus.OK } })

export const healthcheckRoute = createRoute({
    method: 'get',
    path: '/healthcheck',
    request: {},
    responses: {
        200: {
            description: 'Service status',
            content: { 'application/json': { schema: HealthcheckResponse } },
        }
    },
})

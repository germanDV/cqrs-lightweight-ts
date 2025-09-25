import { z } from "@hono/zod-openapi";

export const BadRequestResponse = z.object({
    success: z.literal(false),
    error: z.object({ message: z.string() }),
})


import { z } from "@hono/zod-openapi";

export const BadRequestError = z.object({
    success: z.literal(false),
    error: z.object({ message: z.string() }),
})

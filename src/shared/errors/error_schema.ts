import {z} from "@hono/zod-openapi";

export const ErrorSchema = z.object({
    success: z.literal(false),
    error: z.object({ message: z.string() }),
})


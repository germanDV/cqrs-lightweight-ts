import {ZodTypeAny} from "zod";
import {z} from "@hono/zod-openapi";

export function paginate<T extends ZodTypeAny>(item: T, schemaName: string) {
    return z.object({
        limit: z.number().gt(0).openapi({ description: 'amount of items' }),
        offset: z.number().gte(0).openapi({ description: 'items to skip' }),
        total: z.number().gte(0).optional().openapi({ description: 'total amount of items' }),
        items: z.array(item),
    }).openapi(`Paginated${schemaName}Response`)
}

export const PaginationQuery = z.object({
    limit: z.coerce.number().gt(0).default(10).openapi({ description: 'amount of items' }),
    offset: z.coerce.number().gte(0).default(0).openapi({ description: 'items to skip' }),
    count: z.coerce.boolean().default(false).openapi({ description: 'whether to include the total count of items (less performant)' }),
}).openapi('PaginationQuery')

export const ResourceCreatedResponse = z
    .object({ id: z.string() })
    .openapi({ example: { id: "123e4567-e89b-12d3-a456-426614174000" } })


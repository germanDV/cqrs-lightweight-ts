import {createRoute, OpenAPIHono, z} from '@hono/zod-openapi'
import {ZodTypeAny} from "zod";
import AppContext from "./context.ts"
import {BadRequestResponse} from "./error_responses.ts";

const AuthorsRestController = new OpenAPIHono<AppContext>()

export const CreateAuthorRequestBody = z.object({
    fullName: z.string().min(2).max(16).openapi({
        example: 'Julio Cortázar',
        description: 'Author full name',
    }),
    bio: z.string().max(500).optional().openapi({
        description: 'Author Brief Biography',
    }),
}).openapi('CreateAuthorRequestBody')

const CreateAuthorResponse = z
    .object({ id: z.string() })
    .openapi({ example: { id: "123e4567-e89b-12d3-a456-426614174000" } })

function paginate<T extends ZodTypeAny>(item: T, schemaName: string) {
    return z.object({
        limit: z.number().gt(0).openapi({ description: 'amount of items' }),
        offset: z.number().gte(0).openapi({ description: 'items to skip' }),
        total: z.number().gte(0).optional().openapi({ description: 'total amount of items' }),
        items: z.array(item),
    }).openapi(`Paginated${schemaName}Response`)
}

const AuthorResponse = z.object({
    id: z.string().openapi({ description: "Unique ID of the Author" }),
    fullName: z.string().openapi({ description: "Author's full name" }),
    bio: z.string().optional().openapi({ description: "Author's short biography" }),
}).openapi('AuthorResponse')

const AuthorsResponse = paginate(AuthorResponse, 'Authors')

const PaginationQuery = z.object({
    limit: z.coerce.number().gt(0).default(10).openapi({ description: 'amount of items' }),
    offset: z.coerce.number().gte(0).default(0).openapi({ description: 'items to skip' }),
    count: z.coerce.boolean().default(false).openapi({ description: 'whether to include the total count of items (less performant)' }),
}).openapi('PaginationQuery')

const getAuthorsRoute = createRoute({
    method: "get",
    path: "/",
    request: {
        query: PaginationQuery,
    },
    responses: {
        200: {
            description: 'List of authors',
            content: { 'application/json': { schema: AuthorsResponse } },
        },
    }
})

const createAuthorRoute = createRoute({
    method: "post",
    path: "/",
    request: { body: { content: { 'application/json': { schema: CreateAuthorRequestBody  } } } },
    responses: {
        201: {
            description: 'Successfully created author',
            content: { 'application/json': { schema: CreateAuthorResponse } },
        },
        400: {
            description: 'Invalid data provided',
            content: { 'application/json': { schema: BadRequestResponse } },
        },
    },
})

AuthorsRestController
    .openapi(createAuthorRoute, async (c) => {
        const body = c.req.valid('json')
        c.get('logger').info({ msg: "Author creation request received", body })

        const service = c.get('authorsService')
        const result = await service.createAuthor(body)

        return c.json({ id: result.id }, 201)
    })
    .openapi(getAuthorsRoute, async (c) => {
        const service = c.get('authorsService')
        const { limit, offset } = c.req.valid('query')
        const { items, total } = await service.listAuthors(limit, offset)

        // Anti-Corruption layer: Domain -> DTO
        const response: z.infer<typeof AuthorsResponse> = {
            limit,
            offset,
            total,
            items: items.map(a => ({ id: a.id, fullName: a.name, bio: a.bio }))
        }

        return c.json(response, 200)
    })

export default AuthorsRestController
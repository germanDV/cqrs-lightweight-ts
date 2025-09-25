import {z, createRoute, OpenAPIHono} from "@hono/zod-openapi"
import AppContext from "../../config/app_context.ts"
import {PaginationQuery, ResourceCreatedResponse} from "../dtos/common_dtos.ts";
import {AuthorsResponse, CreateAuthorRequestBody} from "../dtos/authors_dtos.ts";
import {BadRequestError} from "../../shared/errors/bad_request_error.ts";
import CreateAuthorCommand from "../../application/commands/create_author_command.ts";
import GetAuthorsQuery from "../../application/queries/get_authors_query.ts";

const getAuthorsRoute = createRoute({
    method: "get",
    path: "/",
    request: { query: PaginationQuery },
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
            content: { 'application/json': { schema: ResourceCreatedResponse } },
        },
        400: {
            description: 'Invalid data provided',
            content: { 'application/json': { schema: BadRequestError } },
        },
    },
})

export function authorsRestController(
    createAuthorCommand: CreateAuthorCommand,
    getAuthorsQuery: GetAuthorsQuery,
): OpenAPIHono<AppContext> {
    return new OpenAPIHono<AppContext>()
        // POST /authors
        .openapi(createAuthorRoute, async (c) => {
            const body = c.req.valid('json')
            c.get('logger').info({ msg: "Author creation request received", body })
            const result = await createAuthorCommand.execute(body)
            return c.json({ id: result.id }, 201)
        })

        // GET /authors
        .openapi(getAuthorsRoute, async (c) => {
            const data = c.req.valid('query')
            const result = await getAuthorsQuery.execute(data)

            // Anti-Corruption layer: Domain -> DTO
            const response: z.infer<typeof AuthorsResponse> = {
                limit: data.limit,
                offset: data.offset,
                total: result.total,
                items: result.items.map(a => ({
                    id: a.id,
                    fullName: a.name,
                    bio: a.bio,
                    numberOfBooksPublished: a.booksPublishedCount,
                }))
            }

            return c.json(response, 200)
        })
}
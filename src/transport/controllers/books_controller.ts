import {z, createRoute, OpenAPIHono} from "@hono/zod-openapi";
import {ResourceCreatedResponse} from "../dtos/common_dtos.ts";
import {BadRequestError} from "../../shared/errors/bad_request_error.ts";
import {BooksResponse, CreateBookRequestBody} from "../dtos/books_dtos.ts";
import AppContext from "../../config/app_context.ts";
import PublishBookCommand from "../../application/commands/publish_book_command.ts";
import GetBooksQuery from "../../application/queries/get_books_query.ts";

const createBookRoute = createRoute({
    method: "post",
    path: "/",
    request: { body: { content: {"application/json": { schema: CreateBookRequestBody }} } },
    responses: {
        201: {
            description: 'Successfully created book',
            content: { 'application/json': { schema: ResourceCreatedResponse } },
        },
        400: {
            description: 'Invalid data provided',
            content: { 'application/json': { schema: BadRequestError } },
        },
    },
})

const getBooksRoute = createRoute({
    method: "get",
    path: "/",
    request: {},
    responses: {
        200: {
            description: 'List of books and their availability',
            content: { 'application/json': { schema: BooksResponse } },
        },
    },
})

export function booksRestController(
    publishBookCommand: PublishBookCommand,
    getBooksQuery: GetBooksQuery,
): OpenAPIHono<AppContext> {
    return new OpenAPIHono<AppContext>()
        // POST /books
        .openapi(createBookRoute, async (c) => {
            const body = c.req.valid("json")
            c.get("logger").info({ msg: "Book creation request received", body })
            const result = await publishBookCommand.execute(body)
            return c.json({ id: result.id }, 201)
        })

        // GET /books
        .openapi(getBooksRoute, async (c) => {
            const result = await getBooksQuery.execute()

            // Anti-Corruption layer: Domain -> DTO
            const response: z.infer<typeof BooksResponse> = {
                items: result.items.map(i => ({
                    isbn: i.book.isbn.value,
                    title: i.book.title,
                    availableCopies: i.availableCopies,
                }))
            }

            return c.json(response, 200)
        })
}
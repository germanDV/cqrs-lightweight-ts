import {createRoute, OpenAPIHono} from "@hono/zod-openapi";
import {ResourceCreatedResponse} from "../dtos/common_dtos.ts";
import {BadRequestError} from "../../shared/errors/bad_request_error.ts";
import {CreateBookRequestBody} from "../dtos/books_dtos.ts";
import AppContext from "../../config/app_context.ts";
import PublishBookCommand from "../../application/commands/publish_book_command.ts";

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

export function booksRestController(
    publishBookCommand: PublishBookCommand,
): OpenAPIHono<AppContext> {
    return new OpenAPIHono<AppContext>()
        // POST /books
        .openapi(createBookRoute, async (c) => {
            const body = c.req.valid("json")
            c.get("logger").info({ msg: "Book creation request received", body })
            const result = await publishBookCommand.execute(body)
            return c.json({ id: result.id }, 201)
        })
}
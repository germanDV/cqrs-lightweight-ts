import {z} from "@hono/zod-openapi";
import {ErrorSchema} from "./error_schema.ts";
import {ISBN} from "../../domain/entities/value_objects/isbn.ts";

export default class AnonymousBookError extends Error {
    constructor(isbn: ISBN) {
        super(`book with ISBN ${isbn.value} does not have any authors`)
        this.name = "AnonymousBookError"
    }

    /** Converts to NotFoundErrorSchema for transport layer. */
    public toResponse(): z.infer<typeof ErrorSchema> {
        return { success: false, error: { message: this.message } }
    }
}
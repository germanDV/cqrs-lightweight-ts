import {z} from "@hono/zod-openapi";
import {ErrorSchema} from "./error_schema.js";

export class NotFoundError extends Error {
    constructor(entityType: string, entityId: string) {
        super(`${entityType} with ID ${entityId} not found`)
        this.name = "EntityNotFoundError"
    }

    /** Converts to NotFoundErrorSchema for transport layer. */
    public toResponse(): z.infer<typeof ErrorSchema> {
        return { success: false, error: { message: this.message } }
    }
}

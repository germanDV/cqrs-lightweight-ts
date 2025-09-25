import {randomUUID} from "node:crypto";
import {z} from "@hono/zod-openapi";
import pino from "pino";
import {CreateAuthorRequestBody} from './authors_rest_controller.ts'

/** Domain Entity */
type Author = {
    id: string
    name: string
    bio?: string
}

export interface IAuthorsService {
    createAuthor(payload: z.infer<typeof CreateAuthorRequestBody>): Promise<{ id: string }>
    listAuthors(limit: number, offset: number): Promise<{ items: Array<Author>, total: number }>
}

export class AuthorsService implements IAuthorsService {
    private authorsDB: Array<Author> = []
    private readonly logger: pino.Logger

    constructor(logger: pino.Logger) {
        this.logger = logger
    }

    public async createAuthor(payload: z.infer<typeof CreateAuthorRequestBody>): Promise<{ id: string }> {
        const id = randomUUID()
        this.authorsDB.push({ id, name: payload.fullName, bio: payload.bio })
        return { id }
    }

    public async listAuthors(limit: number, offset: number): Promise<{ items: Array<Author>, total: number }> {
        return {
            items: this.authorsDB.slice(offset, offset + limit),
            total: this.authorsDB.length,
        }
    }
}
import {z} from "@hono/zod-openapi";
import {paginate} from "./common_dtos.js";

export const CreateAuthorRequestBody = z.object({
    fullName: z.string().min(2).max(16).openapi({
        example: "Julio Cortázar",
        description: "Author full name",
    }),
    bio: z.string().max(500).optional().openapi({
        description: "Author Brief Biography",
    }),
}).openapi("CreateAuthorRequestBody")

export const AuthorResponse = z.object({
    id: z.string().openapi({ description: "Unique ID of the Author" }),
    fullName: z.string().openapi({ description: "Author's full name" }),
    bio: z.string().optional().openapi({ description: "Author's short biography" }),
    numberOfBooksPublished: z.number().gte(0).openapi({ description: "Number of books published"}),
}).openapi('AuthorResponse')

export const AuthorsResponse = paginate(AuthorResponse, 'Authors')

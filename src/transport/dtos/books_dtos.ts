import {z} from "@hono/zod-openapi";

export const CreateBookRequestBody = z.object({
    isbn: z.string().min(8).max(32).openapi({
        example: "978-84-339-6776-3",
        description: "Book's ISBN"
    }),
    title: z.string().min(1).max(128).openapi({
        example: "Preguntale Al Polvo",
        description: "Book's title",
    }),
    authors: z.array(z.string()).min(1).openapi({
        example: ["123e4567-e89b-12d3-a456-426614174000"],
        description: "List of author IDs",
    }),
}).openapi("CreateBookRequestBody")
import {z} from "@hono/zod-openapi";
import {IAuthorsRepository} from "../interfaces/repositories/authors_repository.ts";
import {PaginationQuery} from "../../transport/dtos/common_dtos.ts";
import {Author} from "../../domain/entities/author.ts";

export default class GetAuthorsQuery {
    constructor(private readonly authorsRepo: IAuthorsRepository) {}

    public async execute(data: z.infer<typeof PaginationQuery>): Promise<{ items: Array<Author>, total: number | undefined }> {
        const authors = await this.authorsRepo.list(data.limit, data.offset)

        let total: number | undefined = undefined
        if (data.count) {
            total = await this.authorsRepo.count()
        }

        return { items: authors, total }
    }
}
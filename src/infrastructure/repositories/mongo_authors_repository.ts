import {IAuthorsRepository} from "../../application/interfaces/repositories/authors_repository.ts";
import {Author} from "../../domain/entities/author.ts";

export class AuthorsRepository implements IAuthorsRepository {
    private authorsDB: Array<Author> = []

    public async save(author: Author): Promise<void> {
        const existingIndex = this.authorsDB.findIndex(a => a.id === author.id)
        if (existingIndex > -1) {
            this.authorsDB[existingIndex] = author
        } else {
            this.authorsDB.push(author)
        }
    }

    public async list(limit: number, offset: number): Promise<Array<Author>> {
        const copy = [...this.authorsDB]
        return copy.slice(offset, offset + limit)
    }

    public async count(): Promise<number> {
        return this.authorsDB.length
    }

    public async findByIds(ids: Array<string>): Promise<Array<Author>> {
        return this.authorsDB.filter(a => ids.includes(a.id))
    }
}
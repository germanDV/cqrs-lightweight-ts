import {Author} from "../../../domain/entities/author.ts";

export interface IAuthorsRepository {
   save(author: Author): Promise<void>
   list(limit: number, offset: number): Promise<Array<Author>>
   count(): Promise<number>
   findByIds(ids: Array<string>): Promise<Array<Author>>
}
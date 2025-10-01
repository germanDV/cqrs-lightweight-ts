import {Author} from "../../../domain/entities/author.ts";
import {ITransactionSession} from "../transaction_manager.ts";

export interface IAuthorsRepository {
   save(author: Author, session: ITransactionSession | undefined): Promise<void>
   list(limit: number, offset: number): Promise<Array<Author>>
   count(): Promise<number>
   findByIds(ids: Array<string>): Promise<Array<Author>>
}
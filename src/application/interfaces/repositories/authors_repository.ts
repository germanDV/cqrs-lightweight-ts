import {Author} from "../../../domain/entities/author.js";
import {ITransactionSession} from "../transaction_manager.js";

export interface IAuthorsRepository {
   save(author: Author, session: ITransactionSession | undefined): Promise<void>
   list(limit: number, offset: number): Promise<Array<Author>>
   count(): Promise<number>
   findByIds(ids: Array<string>): Promise<Array<Author>>
}
import {Book} from "../../../domain/entities/book.ts";
import {ITransactionSession} from "../transaction_manager.ts";

export interface IBooksRepository {
    save(book: Book, session: ITransactionSession | undefined): Promise<void>
    list(): Promise<Array<Book>>
}
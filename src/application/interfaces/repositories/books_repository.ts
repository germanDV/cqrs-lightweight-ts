import {Book} from "../../../domain/entities/book.js";
import {ITransactionSession} from "../transaction_manager.js";

export interface IBooksRepository {
    save(book: Book, session: ITransactionSession | undefined): Promise<void>
    list(): Promise<Array<Book>>
}
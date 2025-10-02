import {IBooksRepository} from "../../application/interfaces/repositories/books_repository.ts";
import {ITransactionSession} from "../../application/interfaces/transaction_manager.ts";
import {Book} from "../../domain/entities/book.ts";

export class BooksRepository implements IBooksRepository {
    private booksDB: Array<Book> = []

    public async save(book: Book, _session: ITransactionSession | undefined): Promise<void> {
        this.booksDB.push(book)
    }

    public async list(): Promise<Array<Book>> {
        return [...this.booksDB]
    }
}
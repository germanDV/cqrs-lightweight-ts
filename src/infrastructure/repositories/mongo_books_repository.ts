import {IBooksRepository} from "../../application/interfaces/repositories/books_repository.ts";
import {Book} from "../../domain/entities/book.ts";

export class BooksRepository implements IBooksRepository {
    private booksDB: Array<Book> = []

    public async save(book: Book): Promise<void> {
        this.booksDB.push(book)
    }
}
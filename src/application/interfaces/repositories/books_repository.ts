import {Book} from "../../../domain/entities/book.ts";

export interface IBooksRepository {
    save(book: Book): Promise<void>
}
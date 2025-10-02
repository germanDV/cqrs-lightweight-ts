import {ISBN} from "./value_objects/isbn.ts"
import AnonymousBookError from "../../shared/errors/anonymous_book_error.ts"
import BookCreatedEvent from "./events/book_created_event.ts"
import {DomainEvent} from "./events/domain_event.ts";

export class Book {
    private readonly _isbn: ISBN
    public readonly title: string
    public readonly authorIds: Array<string>

    constructor(isbn: string, title: string, authorIds: Array<string>) {
        this._isbn = new ISBN(isbn)
        if (authorIds.length === 0) throw new AnonymousBookError(this._isbn)
        this.title = title
        this.authorIds = authorIds
    }

    public static create(
        isbn: string,
        title: string,
        authorIds: Array<string>,
    ): { book: Book, events: Array<DomainEvent>} {
       const book = new Book(isbn, title, authorIds)
        const event = new BookCreatedEvent(book.isbn.value, new Date())
        return { book, events: [event] }
    }

    public get isbn(): ISBN {
        return this._isbn
    }
}
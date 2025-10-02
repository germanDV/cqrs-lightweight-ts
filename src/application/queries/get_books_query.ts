import BookAvailability from "../../domain/entities/value_objects/book_availability.ts";
import {IBooksRepository} from "../interfaces/repositories/books_repository.ts";
import {ILibraryService} from "../interfaces/services/library_service.ts";


export default class GetBooksQuery {
    constructor(
       private readonly booksRepo: IBooksRepository,
       private readonly libraryService: ILibraryService,
    ) {}

    public async execute(): Promise<{ items: Array<BookAvailability> }> {
        const books = await this.booksRepo.list()

        const booksWithAvailability: Array<BookAvailability> = []

        for (const book of books) {
           const availableCopies = await this.libraryService.getAvailableCopies(book.isbn)
            booksWithAvailability.push(new BookAvailability(book, availableCopies))
        }

        return { items: booksWithAvailability }
    }
}
import {z} from "@hono/zod-openapi";
import {IBooksRepository} from "../interfaces/repositories/books_repository.ts";
import {IAuthorsRepository} from "../interfaces/repositories/authors_repository.ts";
import {CreateBookRequestBody} from "../../transport/dtos/books_dtos.js";
import {ResourceCreatedResponse} from "../../transport/dtos/common_dtos.ts";
import {Book} from "../../domain/entities/book.ts";
import DomainEventService from "../services/domain_events_service.ts";
import {ITransactionManager} from "../interfaces/transaction_manager.ts";

export default class PublishBookCommand {
    constructor(
        private readonly booksRepo: IBooksRepository,
        private readonly authorsRepo: IAuthorsRepository,
        private readonly domainEventsService: DomainEventService,
        private readonly transactionManager: ITransactionManager,
    ) {}

    public async execute(
        data: z.infer<typeof CreateBookRequestBody>,
    ): Promise<z.infer<typeof ResourceCreatedResponse>> {
        return await this.transactionManager.runInTransaction(async (session) => {
            const { book, events } = Book.create(data.isbn, data.title, data.authors)

            const ops = [
                this.booksRepo.save(book, session),
                this.domainEventsService.store(events, session),
            ]

            const authors = await this.authorsRepo.findByIds(data.authors)
            authors.forEach(author => {
                const { events } = author.incrementPublishedBookCount()
                ops.push(this.authorsRepo.save(author, session))
                ops.push(this.domainEventsService.store(events, session))
            })

            await Promise.all(ops)
            return { id: book.isbn.value }
        })
    }
}
import {z} from "@hono/zod-openapi";
import {CreateAuthorRequestBody} from "../../transport/dtos/authors_dtos.ts";
import {Author} from "../../domain/entities/author.ts";
import {IAuthorsRepository} from "../interfaces/repositories/authors_repository.ts";
import {ResourceCreatedResponse} from "../../transport/dtos/common_dtos.ts";
import DomainEventService from "../services/domain_events_service.js";

export default class CreateAuthorCommand {
    constructor(
        private readonly authorsRepo: IAuthorsRepository,
        private readonly domainEventsService: DomainEventService,
    ) {}

    public async execute(
        data: z.infer<typeof CreateAuthorRequestBody>,
    ): Promise<z.infer<typeof ResourceCreatedResponse>> {
        const { author, events } = Author.create(data.fullName, data.bio)

        await Promise.all([
            this.authorsRepo.save(author),
            this.domainEventsService.store(events),
        ])

        return { id: author.id }
    }
}
import {IOutboxRepository} from "../interfaces/repositories/outbox_repository.ts";
import {DomainEvent} from "../../domain/entities/events/domain_event.ts";
import OutboxEvent from "../../domain/entities/events/outbox_event.ts";

export default class DomainEventService {
    constructor(private readonly outboxRepository: IOutboxRepository) {}

    /** Stores events in Outbox. */
    public async store(domainEvents: Array<DomainEvent>): Promise<void> {
        await Promise.all(
            domainEvents
                .map(domainEvent => new OutboxEvent(domainEvent))
                .map(outboxEvent => this.outboxRepository.save(outboxEvent))
        )
    }

    /** Looks for unsent messages in Outbox and sends them. */
    public async send(): Promise<void> {
        const unsentEvents = await this.outboxRepository.findUnsent()
        console.log(`Producing events to Pulsar: ${JSON.stringify(unsentEvents)}`)
        const ops = unsentEvents.map(e => this.outboxRepository.markAsSent(e.id))
        await Promise.all(ops)
    }
}
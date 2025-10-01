import {IOutboxRepository} from "../interfaces/repositories/outbox_repository.ts";
import {DomainEvent} from "../../domain/entities/events/domain_event.ts";
import OutboxEvent from "../../domain/entities/events/outbox_event.ts";
import {ITransactionSession} from "../interfaces/transaction_manager.js";

export default class DomainEventService {
    constructor(private readonly outboxRepository: IOutboxRepository) {}

    /** Stores events in Outbox. */
    public async store(domainEvents: Array<DomainEvent>, session: ITransactionSession | undefined): Promise<void> {
        await Promise.all(
            domainEvents
                .map(domainEvent => new OutboxEvent(domainEvent))
                .map(outboxEvent => this.outboxRepository.save(outboxEvent, session))
        )
    }

    /** Looks for unsent messages in Outbox and sends them. */
    public async send(session: ITransactionSession | undefined): Promise<void> {
        const unsentEvents = await this.outboxRepository.findUnsent()
        console.log(`Producing events to Pulsar: ${JSON.stringify(unsentEvents)}`)
        const ops = unsentEvents.map(e => this.outboxRepository.markAsSent(e.id, session))
        await Promise.all(ops)
    }
}
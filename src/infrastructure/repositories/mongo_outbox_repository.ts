import {IOutboxRepository} from "../../application/interfaces/repositories/outbox_repository.js";
import {ITransactionSession} from "../../application/interfaces/transaction_manager.js";
import OutboxEvent from "../../domain/entities/events/outbox_event.js";
import {NotFoundError} from "../../shared/errors/not_found_error.js";

export class OutboxRepository implements IOutboxRepository {
    private outboxDB: Array<OutboxEvent> = []

    public async save(event: OutboxEvent, _session: ITransactionSession | undefined): Promise<void> {
        this.outboxDB.push(event)
    }

    public async findUnsent(): Promise<Array<OutboxEvent>> {
        return this.outboxDB.filter(e => !e.sentAt)
    }

    public async markAsSent(id: string, _session: ITransactionSession | undefined): Promise<void> {
        const eventIndex = this.outboxDB.findIndex(e => e.id === id)
        if (eventIndex === -1) throw new NotFoundError("event", id)

        const event = this.outboxDB[eventIndex]
        event.markAsSent(new Date())
        this.outboxDB[eventIndex] = event
    }
}
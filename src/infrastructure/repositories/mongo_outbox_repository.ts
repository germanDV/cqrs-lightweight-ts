import {IOutboxRepository} from "../../application/interfaces/repositories/outbox_repository.ts";
import OutboxEvent from "../../domain/entities/events/outbox_event.ts";
import {NotFoundError} from "../../shared/errors/not_found_error.ts";

export class OutboxRepository implements IOutboxRepository {
    private outboxDB: Array<OutboxEvent> = []

    public async save(event: OutboxEvent): Promise<void> {
        this.outboxDB.push(event)
    }

    public async findUnsent(): Promise<Array<OutboxEvent>> {
        return this.outboxDB.filter(e => !e.sentAt)
    }

    public async markAsSent(id: string): Promise<void> {
        const eventIndex = this.outboxDB.findIndex(e => e.id === id)
        if (eventIndex === -1) throw new NotFoundError("event", id)

        const event = this.outboxDB[eventIndex]
        event.markAsSent(new Date())
        this.outboxDB[eventIndex] = event
    }
}
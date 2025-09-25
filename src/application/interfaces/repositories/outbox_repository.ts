import OutboxEvent from "../../../domain/entities/events/outbox_event.ts"

export interface IOutboxRepository {
    save(event: OutboxEvent): Promise<void>
    findUnsent(): Promise<Array<OutboxEvent>>
    markAsSent(id: string): Promise<void>
}
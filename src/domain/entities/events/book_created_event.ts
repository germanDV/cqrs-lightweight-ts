import {DomainEvent} from "./domain_event.js"

export default class BookCreatedEvent implements DomainEvent {
    public readonly eventType = "BOOK_CREATED"
    public readonly schemaVersion = "1.0"
    constructor(public readonly entityId: string, public readonly occurredAt: Date) {}
}
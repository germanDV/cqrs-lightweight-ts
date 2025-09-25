export interface DomainEvent {
    readonly entityId: string;
    readonly eventType: string;
    readonly occurredAt: Date;
    readonly schemaVersion: string;
}
import {randomUUID} from "node:crypto";
import {DomainEvent} from "./domain_event.ts";

export default class OutboxEvent {
    public readonly id: string;
    public readonly eventData: string; // JSON serialized event
    private _sentAt: Date | null;

    constructor(domainEvent: DomainEvent) {
        this.id = randomUUID()
        this.eventData = JSON.stringify(domainEvent)
        this._sentAt = null
    }

    public get sentAt(): Date | null {
        return this._sentAt
    }

    public markAsSent(sentAt: Date): void {
        this._sentAt = sentAt
    }
}
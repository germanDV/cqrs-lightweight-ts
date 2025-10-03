import {DomainEvent} from "./domain_event.js"

export default class BibliographyIncreasedEvent implements DomainEvent {
    public readonly eventType = "BIBLIOGRAPHY_INCREASED"
    public readonly schemaVersion = "1.0"
    constructor(
        public readonly entityId: string,
        public readonly occurredAt: Date,
        public readonly bibliographySize: number,
    ) {}
}

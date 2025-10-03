import {OutboxRepository} from "../../infrastructure/repositories/mongo_outbox_repository.js";
import DomainEventService from "../../application/services/domain_events_service.js";

const outboxRepository = new OutboxRepository()
const domainEventsService = new DomainEventService(outboxRepository)

// Start a background worker that sends events in the outbox.
setInterval(() => {
    domainEventsService
        .send(undefined)
        .catch(err => console.log(`error sending event: ${err.message}`))
}, 10_000)

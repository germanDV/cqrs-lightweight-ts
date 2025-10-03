import OutboxEvent from "../../../domain/entities/events/outbox_event.js"
import {ITransactionSession} from "../transaction_manager.js";

export interface IOutboxRepository {
    save(event: OutboxEvent, session: ITransactionSession | undefined): Promise<void>
    findUnsent(): Promise<Array<OutboxEvent>>
    markAsSent(id: string, session: ITransactionSession | undefined): Promise<void>
}
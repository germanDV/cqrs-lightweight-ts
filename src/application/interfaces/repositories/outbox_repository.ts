import OutboxEvent from "../../../domain/entities/events/outbox_event.ts"
import {ITransactionSession} from "../transaction_manager.ts";

export interface IOutboxRepository {
    save(event: OutboxEvent, session: ITransactionSession | undefined): Promise<void>
    findUnsent(): Promise<Array<OutboxEvent>>
    markAsSent(id: string, session: ITransactionSession | undefined): Promise<void>
}
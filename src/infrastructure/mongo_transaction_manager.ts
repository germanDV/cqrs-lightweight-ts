import {ITransactionManager, ITransactionSession} from "../application/interfaces/transaction_manager.ts"

class InMemoryTransactionSession implements ITransactionSession {
    constructor(public readonly id: string){}
}

export default class InMemoryTransactionManager implements ITransactionManager {
    private activeTransactions = new Map<string, InMemoryTransactionSession>
    private transactionCounter = 0

    public async runInTransaction<T>(callback: (session: ITransactionSession) => Promise<T>): Promise<T> {
        const transactionId = `tx_${++this.transactionCounter}`
        const session = new InMemoryTransactionSession(transactionId)

        this.activeTransactions.set(transactionId, session)

        try {
            const result = await callback(session)
            this.commit(session)
            return result
        } catch (err) {
            this.rollback(session)
            throw err
        } finally {
            this.activeTransactions.delete(transactionId)
        }
    }

    public isTransactionActive(sessionId: string): boolean {
        return this.activeTransactions.has(sessionId);
    }

    private commit(session: InMemoryTransactionSession): void {
        console.log(`committed transaction ${session.id}`)
    }

    private rollback(session: InMemoryTransactionSession): void {
        console.log(`rolled back transaction ${session.id}`)
    }
}
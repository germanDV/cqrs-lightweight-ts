export interface ITransactionSession {
    // This represents a database session/transaction
    // For MongoDB, this would wrap ClientSession
    // For in-memory, we'll use a simple identifier
}

export interface ITransactionManager {
    /**
     * Executes a callback function within a database transaction.
     * If the callback throws an error, the transaction is rolled back.
     * Otherwise, the transaction is committed.
     */
    runInTransaction<T>(callback: (session: ITransactionSession) => Promise<T>): Promise<T>
}
enum CircuitState {
    /** Normal operation. */
    CLOSED = 'CLOSED',
    /** Broken state, blocking requests. */
    OPEN = 'OPEN',
    /** Testing if services recovered. */
    HALF_OPEN = 'HALF_OPEN'
}

export default class CircuitBreaker {
    private state = CircuitState.CLOSED
    private failureCount = 0
    private lastFailureTime: Date | null = null
    private nextAttemptTime: Date | null = null

    constructor(
        private readonly failureThreshold = 2,
        private recoveryTimeoutMs = 60_000,
        private readonly maxBackoffMs = 90_000,
    ) {}

    public canProceed(): boolean {
        if (this.state === CircuitState.CLOSED) return true

        if (this.state === CircuitState.OPEN && this.shouldAttemptReset()) {
            this.state = CircuitState.HALF_OPEN
            return true
        }

        return false
    }

    public recordSuccess(): void {
        this.failureCount = 0
        this.state = CircuitState.CLOSED
        this.lastFailureTime = null
        this.nextAttemptTime = null
    }

    public recordFailure(): void {
        this.failureCount++
        this.lastFailureTime = new Date()
        if (this.failureCount >= this.failureThreshold) {
            this.state = CircuitState.OPEN
            this.scheduleNextAttempt()
        }
    }

    private scheduleNextAttempt(): void {
        // Exponential backoff, capped at maxBackoffMs
        const backoffMs = Math.min(
            Math.pow(2, this.failureCount - this.failureThreshold) * 1000,
            this.maxBackoffMs
        );

        this.nextAttemptTime = new Date(Date.now() + backoffMs);
    }

    private shouldAttemptReset(): boolean {
        return this.nextAttemptTime !== null && new Date() >= this.nextAttemptTime
    }

    /** Utility method for monitoring. */
    public getStatus() {
        return {
            state: this.state,
            failureCount: this.failureCount,
            lastFailureTime: this.lastFailureTime,
            nextAttemptTime: this.nextAttemptTime
        };
    }
}
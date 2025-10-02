import {ILibraryService} from "../../application/interfaces/services/library_service.ts";
import {ISBN} from "../../domain/entities/value_objects/isbn.ts";
import CircuitBreaker from "../../shared/utils/circuit_breaker.ts";

class GrpcClient {
    constructor(private readonly url: string) {}

    public async request<T>(x: T): Promise<T> {
        console.log(`gRPC request to ${this.url}`)
        return x
    }
}

/** This is an external service. All external services must implement a circuit breaker pattern. */
export default class LibraryService implements ILibraryService {
    private readonly client: GrpcClient
    private readonly circuitBreaker: CircuitBreaker

    constructor(url: string)  {
        this.client = new GrpcClient(url)
        this.circuitBreaker = new CircuitBreaker()
    }

    public async getAvailableCopies(_isbn: ISBN): Promise<number> {
        if (!this.circuitBreaker.canProceed()) {
            throw new Error('Library service temporarily unavailable')
        }

        try {
            const result = await this.client.request(4)
            this.circuitBreaker.recordSuccess()
            return result
        } catch (err) {
            this.circuitBreaker.recordFailure()
            throw new Error('Failed to retrieve book availability')
        }
    }

    public getCircuitBreakerStatus() {
        return this.circuitBreaker.getStatus()
    }
}
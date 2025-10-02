import {OpenAPIHono} from "@hono/zod-openapi";
import AppContext from "./config/app_context.ts";
import Logger from "./infrastructure/logging/logger.ts";
import {serve} from "@hono/node-server";
import {injectDependencies} from "./transport/middleware/dependency_injection_mdw.ts";
import {setupOpenAPI} from "./transport/controllers/openapi.ts";
import {healthcheckRoute, HealthStatus} from "./transport/controllers/healtcheck_controller.ts";
import {AuthorsRepository} from "./infrastructure/repositories/mongo_authors_repository.ts";
import {BooksRepository} from "./infrastructure/repositories/mongo_books_repository.ts"
import {OutboxRepository} from "./infrastructure/repositories/mongo_outbox_repository.ts";
import DomainEventService from "./application/services/domain_events_service.ts";
import LibraryService from "./infrastructure/services/external_library_service.ts";
import CreateAuthorCommand from "./application/commands/create_author_command.ts";
import PublishBookCommand from "./application/commands/publish_book_command.ts";
import GetAuthorsQuery from "./application/queries/get_authors_query.ts";
import GetBooksQuery from "./application/queries/get_books_query.ts";
import {authorsRestController} from "./transport/controllers/authors_controller.ts";
import {booksRestController} from "./transport/controllers/books_controller.ts";
import InMemoryTransactionManager from "./infrastructure/mongo_transaction_manager.ts";

const app = new OpenAPIHono<AppContext>()
const logger = new Logger(process.env.LOG_LEVEL ?? 'info')

// Repositories
const authorsRepository = new AuthorsRepository()
const booksRepository = new BooksRepository()
const outboxRepository = new OutboxRepository()
const transactionManager = new InMemoryTransactionManager()

// Services
const domainEventsService = new DomainEventService(outboxRepository)

// External Services
const libraryService = new LibraryService("grpc://library")

// Commands
const createAuthorCommand = new CreateAuthorCommand(authorsRepository, domainEventsService, transactionManager)
const publishBookCommand = new PublishBookCommand(booksRepository, authorsRepository, domainEventsService, transactionManager)

// Queries
const getAuthorsQuery = new GetAuthorsQuery(authorsRepository)
const getBooksQuery = new GetBooksQuery(booksRepository, libraryService)

// Middlewares
injectDependencies(app, { logger })
setupOpenAPI(app)

// Routes
app.openapi(healthcheckRoute, (c) => c.json({ status: HealthStatus.OK }, 200))
app.route("/authors", authorsRestController(createAuthorCommand, getAuthorsQuery))
app.route("/books", booksRestController(publishBookCommand, getBooksQuery))

const port = Number(process.env.PORT ?? 3000)
serve({ fetch: app.fetch, port, hostname: '0.0.0.0' })

// Start background worker
setInterval(() => {
    domainEventsService.send(undefined).catch(err => console.log(`error sending event: ${err.message}`))
}, 15_000)

logger.info({ msg: 'Server started', port })
logger.info({ msg: 'OpenApi specs available', url: `http://localhost:${port}/openapi.json`})
logger.info({ msg: 'OpenApi UI available', url: `http://localhost:${port}/scalar`})

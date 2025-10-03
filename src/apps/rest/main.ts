import {OpenAPIHono} from "@hono/zod-openapi";
import {serve} from "@hono/node-server";
import AppContext from "../../config/app_context.js";
import Logger from "../../infrastructure/logging/logger.js";
import {injectDependencies} from "../../transport/middleware/dependency_injection_mdw.js";
import {setupOpenAPI} from "../../transport/controllers/openapi.js";
import {healthcheckRoute, HealthStatus} from "../../transport/controllers/healtcheck_controller.js";
import {AuthorsRepository} from "../../infrastructure/repositories/mongo_authors_repository.js";
import {BooksRepository} from "../../infrastructure/repositories/mongo_books_repository.js"
import {OutboxRepository} from "../../infrastructure/repositories/mongo_outbox_repository.js";
import DomainEventService from "../../application/services/domain_events_service.js";
import LibraryService from "../../infrastructure/services/external_library_service.js";
import CreateAuthorCommand from "../../application/commands/create_author_command.js";
import PublishBookCommand from "../../application/commands/publish_book_command.js";
import GetAuthorsQuery from "../../application/queries/get_authors_query.js";
import GetBooksQuery from "../../application/queries/get_books_query.js";
import {authorsRestController} from "../../transport/controllers/authors_controller.js";
import {booksRestController} from "../../transport/controllers/books_controller.js";
import InMemoryTransactionManager from "../../infrastructure/mongo_transaction_manager.js";

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

logger.info({ msg: 'REST API server started', port })
logger.info({ msg: 'OpenApi specs available', url: `http://localhost:${port}/openapi.json`})
logger.info({ msg: 'OpenApi UI available', url: `http://localhost:${port}/scalar`})

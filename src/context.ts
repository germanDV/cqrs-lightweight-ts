import pino from "pino";
import { IAuthorsService } from "./authors_service.ts";

type AppContext = {
    Variables: {
        logger: pino.Logger
        authorsService: IAuthorsService
    }
}

export default AppContext

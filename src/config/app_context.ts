import Logger from "../infrastructure/logging/logger.ts"

type AppContext = {
    Variables: {
        logger: Logger
    }
}

export default AppContext

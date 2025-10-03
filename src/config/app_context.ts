import Logger from "../infrastructure/logging/logger.js"

type AppContext = {
    Variables: {
        logger: Logger
    }
}

export default AppContext

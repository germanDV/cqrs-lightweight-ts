import pino from "pino";

class Logger {
    private readonly pinoLogger: pino.Logger;

    constructor(level: string) {
        this.pinoLogger = pino({ level, base: undefined })
    }

    public debug(...args: Parameters<pino.LogFn>) {
        return this.pinoLogger.debug(...args);
    }

    public info(...args: Parameters<pino.LogFn>) {
        return this.pinoLogger.info(...args);
    }

    public warn(...args: Parameters<pino.LogFn>) {
        return this.pinoLogger.warn(...args);
    }

    public error(...args: Parameters<pino.LogFn>) {
        return this.pinoLogger.error(...args);
    }

    public fatal(...args: Parameters<pino.LogFn>) {
        return this.pinoLogger.fatal(...args);
    }
}

export default Logger

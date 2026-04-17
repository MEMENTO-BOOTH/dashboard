type LogLevel = "debug" | "info" | "warn" | "error";

type LogPayload = Record<string, unknown>;

function format(level: LogLevel, message: string, payload?: LogPayload) {
  return JSON.stringify({
    level,
    message,
    timestamp: new Date().toISOString(),
    ...payload,
  });
}

export const logger = {
  debug(message: string, payload?: LogPayload) {
    if (process.env.NODE_ENV === "development") {
      console.warn(format("debug", message, payload));
    }
  },
  info(message: string, payload?: LogPayload) {
    console.warn(format("info", message, payload));
  },
  warn(message: string, payload?: LogPayload) {
    console.warn(format("warn", message, payload));
  },
  error(message: string, payload?: LogPayload) {
    console.error(format("error", message, payload));
  },
};

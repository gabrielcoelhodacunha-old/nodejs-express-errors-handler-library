import { Console } from "node:console";

export interface IExpressErrorHandlerOptions {
  logger: ILogger;
}

export interface ILogger {
  log: typeof Console.prototype.log;
}

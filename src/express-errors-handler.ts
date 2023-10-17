import type { Request, Response, NextFunction } from "express";
import {
  ApplicationError,
  IExpressErrorHandlerOptions,
  ILogger,
} from "./types";

export class ExpressErrorsHandler {
  private readonly _logger: ILogger;

  /* istanbul ignore next */
  constructor({ logger }: IExpressErrorHandlerOptions = { logger: console }) {
    this._logger = logger;
  }

  public handle(
    error: Error,
    _request: Request,
    response: Response,
    _next: NextFunction
  ): void {
    const _error =
      error instanceof ApplicationError ? error : new ApplicationError(error);
    this._logger.log(`Error origin: ${_error.origin}`);
    response.status(_error.statusCode).send({ error: _error.message });
  }
}

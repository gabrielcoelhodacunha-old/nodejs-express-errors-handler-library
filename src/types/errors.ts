import { StatusCodes } from "http-status-codes";

export class ApplicationError extends Error {
  private _origin: Error | null;
  get origin(): typeof this._origin {
    return this._origin;
  }
  private _statusCode: StatusCodes;
  get statusCode(): typeof this._statusCode {
    return this._statusCode;
  }

  constructor(
    origin?: unknown,
    message: string = "Application failed to process the request",
    statusCode: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super(message);
    this._origin = origin instanceof Error ? origin : null;
    this._statusCode = statusCode;
  }
}

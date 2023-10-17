import { Response, Request, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ApplicationError, ILogger } from "../types";
import { ExpressErrorsHandler } from "../express-errors-handler";

describe("ExpressErrorsHandler", () => {
  const spies = {} as {
    response: jest.MockedObjectDeep<Response>;
    logger: jest.MockedObjectDeep<ILogger>;
  };
  const sut = {} as { expressErrorsHandler: ExpressErrorsHandler };

  beforeAll(() => {
    spies.response = jest.mocked({
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as unknown as Response);
    spies.logger = jest.mocked({ log: jest.fn() } as ILogger);
    sut.expressErrorsHandler = new ExpressErrorsHandler({
      logger: spies.logger,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("feature: handle errors", () => {
    const statuses = [
      StatusCodes.BAD_REQUEST,
      StatusCodes.INTERNAL_SERVER_ERROR,
    ];
    const messages = [
      "New ApplicationError message",
      new ApplicationError().message,
    ];
    const errors = [
      new ApplicationError(null, messages[0], statuses[0]),
      new Error("Not an ApplicationError"),
    ];
    function isApplicationError(error: unknown): error is ApplicationError {
      return error instanceof ApplicationError;
    }
    describe.each`
      error        | status         | message
      ${errors[0]} | ${statuses[0]} | ${messages[0]}
      ${errors[1]} | ${statuses[1]} | ${messages[1]}
    `(
      "scenario: handles error sucessfully",
      ({
        error,
        status,
        message,
      }: {
        error: Error;
        status: StatusCodes;
        message: string;
      }) => {
        it(`given error is ${
          isApplicationError(error)
            ? `an ApplicationError
            and has status ${status}
            and message '${message}'`
            : "not an ApplicationError"
        }
          when I handle it
          then I should respond with status ${status}
            and message '${message}'`, async () => {
          let request: Request;
          let nextFunction: NextFunction;
          async function arrange() {
            request = {} as Request;
            nextFunction = {} as NextFunction;
          }
          async function act() {
            sut.expressErrorsHandler.handle(
              error,
              request,
              spies.response,
              nextFunction
            );
          }
          async function assert() {
            expect(spies.response.status).toHaveBeenLastCalledWith(status);
            expect(spies.response.send).toHaveBeenLastCalledWith({
              error: message,
            });
          }

          await arrange().then(act).then(assert);
        });
      }
    );
  });
});

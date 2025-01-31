// errors.ts
import { HttpStatus } from "../utils/utils";

export class CustomAPIError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }

  static response(message: string, statusCode: number) {
    return new CustomAPIError(message, statusCode);
  }
}

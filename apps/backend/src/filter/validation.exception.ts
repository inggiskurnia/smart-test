import { HttpException, HttpStatus, ValidationError } from "@nestjs/common";

export class ValidationException extends HttpException {
    constructor(
        public validationErrors: ValidationError[],
    ) {
        super(validationErrors, HttpStatus.BAD_REQUEST);
    }

    public getErrorMessage(): string {
        return this.validationErrors
            .map((error) => Object.values(error.constraints || {}))
            .flat()
            .join(', ');
    }
}
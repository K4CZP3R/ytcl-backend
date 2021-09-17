export default class HttpException extends Error {
    errorCode: number;
    message: string;

    constructor(errorCode: number, message: string) {
        super(message);
        this.errorCode = errorCode;
        this.message = message
    }
}
import HttpException from "../exceptions/http.exception";
import { Request, Response, NextFunction } from "express";
import { stat } from "fs";

export function errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {
    var status = error.errorCode || 500;
    var message = error.message || 'Something went wrong';

    response.status(status).send({ status, message, })

}
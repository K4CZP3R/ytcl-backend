import { Router, Request, Response, NextFunction } from 'express';
import HttpException from '../exceptions/http.exception';
import { Controller } from '../interfaces/controller.interface';
import GoogleAuth from '../logic/google-auth.logic';

export class MainController implements Controller {
    public path = "/v2";
    public router = Router();

    private googleAuth = new GoogleAuth();

    constructor() {
        this.router.get('/', this.get.bind(this));
        this.router.get('/test', this.test.bind(this));
        this.router.get('/exception', this.excep.bind(this));

    }

    async get(req: Request, res: Response, next: NextFunction) {
        return res.status(200).send("Hello /");
    }
    async test(req: Request, res: Response, next: NextFunction) {
        return res.status(200).send("Hello /test")
    }
    async excep(req: Request, res: Response, next: NextFunction) {
        next(new HttpException(404, "error message"));
    }
}
import { Router, Request, Response, NextFunction } from 'express';
import HttpException from '../exceptions/http.exception';
import googleAuthFromEnv from '../helpers/google-auth.helper';
import { Controller } from '../interfaces/controller.interface';
import Store from '../interfaces/store.interface';
import GoogleAuth from '../logic/google-auth.logic';
import UserTokenStore from '../logic/user-token-store.logic';

export class GoogleAuthController implements Controller {
    public path = "/auth";
    public router = Router();

    private googleAuth: GoogleAuth | undefined
    private userTokenStore: UserTokenStore

    constructor(store: Store) {
        googleAuthFromEnv().then((gauth) => {
            this.googleAuth = gauth
        })

        this.userTokenStore = new UserTokenStore(store);

        this.router.get('/', this.require.bind(this));
        this.router.get('/convert', this.require.bind(this));
    }

    async convert(req: Request, res: Response, next: NextFunction) {

    }

    async require(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.query.redirect === undefined) {
                throw new Error("Missing parameters");
            }
            if (this.googleAuth === undefined) {
                throw new Error("Google Auth not ready.")
            }
            return res.redirect(this.googleAuth.getAuthUrl(req.query.redirect as string))
        }
        catch (e: any) {
            next(new HttpException(400, e.message))
        }
    }
}
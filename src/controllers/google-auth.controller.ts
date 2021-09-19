import { Router, Request, Response, NextFunction } from 'express';
import HttpException from '../exceptions/http.exception';
import googleAuthFromEnv from '../helpers/google-auth.helper';
import { Controller } from '../interfaces/controller.interface';
import Store from '../interfaces/store.interface';
import GoogleAuth from '../logic/google-auth.logic';
import UserTokenStore from '../logic/user-token-store.logic';
import { v4 as uuidv4 } from 'uuid';
import ApiResponse from '../interfaces/api-response.interface';

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
        this.router.get('/convert', this.convert.bind(this));
        // this.router.get('/info', this.info.bind(this))
    }

    async info(req: Request, res: Response, next: NextFunction){
        try{
            if(!req.query.userId){
                throw new Error("Missing parameters.");
            }
            if(!this.googleAuth){
                throw new Error("Google auth not ready!");
            }

            let token = await this.userTokenStore.getToken(req.query.userId as string)
            let apiResp = await this.googleAuth.getTokenInfo(token);

            let resp: ApiResponse = {
                success: true,
                data: {
                    raw: token,
                    apiResp: apiResp
                }
            }
            res.status(200).send(resp)
        }
        catch (e: any) {
            next(new HttpException(400, e.message));
        }
    }

    async convert(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.query.code)  {
                throw new Error("Missing parameters.");
            }
            if (!this.googleAuth) {
                throw new Error("Google auth not ready.");
            }

            let code = decodeURI(req.query.code as string)
            let gtr = await this.googleAuth.getToken(code)
            
            let userId = uuidv4();

            await this.userTokenStore.cacheToken(userId, gtr);

            let apiResp: ApiResponse = { data: userId, success: true }
            res.status(200).send(apiResp)

        }
        catch (e: any) {
            next(new HttpException(400, e.message));
        }

    }

    async require(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.query.redirect) {
                throw new Error("Missing parameters");
            }
            if (!this.googleAuth) {
                throw new Error("Google Auth not ready.")
            }
            return res.redirect(this.googleAuth.getAuthUrl(req.query.redirect as string))
        }
        catch (e: any) {
            next(new HttpException(400, e.message))
        }
    }
}
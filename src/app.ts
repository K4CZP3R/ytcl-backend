import express from "express";
import helmet from "helmet";
import cors from "cors";
import { GoogleAuthController } from "./controllers/google-auth.controller";
import { Controller } from "./interfaces/controller.interface";
import { errorMiddleware } from "./middlewares/error-handler.middleware";
import redisStoreFromEnv from "./helpers/store.helper";
import Store from "./interfaces/store.interface";
export default class App {
    public app: express.Express;

    private controllers: Controller[] = [
        new GoogleAuthController(this.store)
    ]

    constructor(private store: Store) {
        this.app = express();

        this.setupMiddlewares();
        this.setupControllers();
        this.setupAfterMiddlewares();
    }

    private setupMiddlewares() {
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(express.json())

    }
    private setupControllers() {
        this.controllers.forEach((controller) => {
            this.app.use(controller.path, controller.router);
        });
    }

    private setupAfterMiddlewares() {
        this.app.use(errorMiddleware);
    }

}


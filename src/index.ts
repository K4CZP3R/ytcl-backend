import * as dotenv from "dotenv";
import App from "./app"
import http from "http";
import getEnv from "./helpers/dotenv.helper";
import InMemoryStore from "./logic/in-memory.store";
import redisStoreFromEnv from "./helpers/store.helper";
import Store from "./interfaces/store.interface";
dotenv.config();


let env = getEnv();



if (!env.PORT) {
    console.error("Port for the server is not specified!");
    process.exit(1);
}

let store = env.USE_REDIS == "true" ? redisStoreFromEnv() : new InMemoryStore();

let app = new App(store)


http.createServer(app.app).listen(parseInt(env.PORT), () => {
    console.log("App listening on port", env.PORT)
})
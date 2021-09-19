import * as dotenv from "dotenv";
import App from "./app"
import http from "http";
import getEnv from "./helpers/dotenv.helper";
import InMemoryStore from "./logic/in-memory.store";
import redisStoreFromEnv from "./helpers/store.helper";
dotenv.config();


let env = getEnv();



if (!env.PORT) {
    console.error("Port for the server is not specified!");
    process.exit(1);
}


let app = new App(redisStoreFromEnv())


http.createServer(app.app).listen(parseInt(env.PORT), () => {
    console.log("App listening on port", env.PORT)
})
import * as dotenv from "dotenv";
import App from "./app"
import http from "http";
import getEnv from "./helpers/dotenv.helper";
dotenv.config();


let env = getEnv();



if (!env.PORT) {
    console.error("Port for the server is not specified!");
    process.exit(1);
}


let app = new App()


http.createServer(app.app).listen(parseInt(env.PORT), () => {
    console.log("App listening on port", env.PORT)
})
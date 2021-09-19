import fs from "fs";
import GoogleAuth from "../logic/google-auth.logic";
import getEnv from "./dotenv.helper";

export default async function googleAuthFromEnv(): Promise<GoogleAuth> {
    let env = getEnv();

    let googleSecrets = (await fs.promises.readFile(env.GOOGLE_TOKEN_PATH)).toString()
    let scopes = env.GOOGLE_API_SCOPES.split(',')

    return new GoogleAuth(googleSecrets, scopes)
}
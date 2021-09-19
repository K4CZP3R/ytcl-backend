import Store from "../logic/store.logic";
import getEnv from "./dotenv.helper";

export default function storeFromEnv(): Store {
    return new Store(getEnv().REDIS_HOST)
}
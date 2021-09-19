import Store from "../logic/in-memory.store";
import RedisStore from "../logic/redis.store";
import getEnv from "./dotenv.helper";

export default function redisStoreFromEnv(): RedisStore {
    return new RedisStore(getEnv().REDIS_HOST)
}
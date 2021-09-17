import { createClient } from "redis";
import { RedisClientType } from "redis/dist/lib/client";
import { RedisModules } from "redis/dist/lib/commands";
import { RedisLuaScripts } from "redis/dist/lib/lua-script";
import getEnv from "../helpers/dotenv.helper";


export default class Store {
    client: RedisClientType<RedisModules, RedisLuaScripts>

    constructor() {
        if (!getEnv().REDIS_HOST) {
            throw new Error("Redis host not specified!")
        }

        this.client = createClient({
            socket: {
                url: getEnv().REDIS_HOST
            }
        })

        this.client.on('error', (err) => {
            console.error("redis error, reconnecting!");

            this.client.disconnect().then(() => {
                setInterval(() => {
                    this.client.connect()
                })
            })
        })

        this.client.connect();
    }

    removeKey(key: string): Promise<number> {
        return this.client.del(key);
    }

    sendToCache<T>(key: string, value: T): Promise<string | null> {
        return this.client.set(key, JSON.stringify(value)).then((resp) => {
            this.client.expire(key, 60 * 60)
            return resp
        })
    }

    async readFromCache<T>(key: string): Promise<T> {
        return JSON.parse(await this.client.get(key)) as T
    }
}
import Env from '../interfaces/env.interfaces'
export default function getEnv(): Env {
    return process.env as unknown as Env
}
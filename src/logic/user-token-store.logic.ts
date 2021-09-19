import { GetTokenResponse } from "google-auth-library/build/src/auth/oauth2client";
import Store from "../interfaces/store.interface"

export default class UserTokenStore {
    store: Store;

    constructor(store: Store) {
        this.store = store;
    }

    cacheToken(userId: string, token: GetTokenResponse): Promise<string | null> {
        return this.store.sendToCache<GetTokenResponse>(userId, token)
    }
    getToken(userId: string): Promise<GetTokenResponse> {
        return this.store.readFromCache<GetTokenResponse>(userId);
    }


}
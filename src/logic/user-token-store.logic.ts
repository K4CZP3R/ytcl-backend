import { GetTokenResponse } from "google-auth-library/build/src/auth/oauth2client";
import UserToken from "../interfaces/user-token.interface";
import Store from "./store.logic";

export default class UserTokenStore {
    store: Store;

    constructor() {
        this.store = new Store();
    }

    cacheToken(userId: string, token: GetTokenResponse): Promise<string | null> {
        return this.store.sendToCache<GetTokenResponse>(userId, token)
    }
    getToken(userId: string): Promise<GetTokenResponse> {
        return this.store.readFromCache<GetTokenResponse>(userId);
    }


}
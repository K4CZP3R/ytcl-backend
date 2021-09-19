import Store from "../interfaces/store.interface";
import InMemoryStore from "./in-memory.store";
import UserTokenStore from "./user-token-store.logic";
import { GetTokenResponse } from "google-auth-library/build/src/auth/oauth2client";


describe("UserTokenStore logic tests", () => {

    function getGetTokenResponse(): GetTokenResponse {
        return {
            tokens: {
                access_token: "",
                expiry_date: 0,
                id_token: "",
                refresh_token: "",
                scope: "",
                token_type: ""
            },
            res: null
        }

    }

    test("Cache token, return stringified tokenresponse", async () => {
        let userTokenStore = new UserTokenStore(new InMemoryStore());

        let resp =await userTokenStore.cacheToken("userId", getGetTokenResponse());
        expect(resp).toBe(JSON.stringify(getGetTokenResponse()));
    })
    test("Cache, and get back", async()=>{
        let userTokenStore = new UserTokenStore(new InMemoryStore());

        let resp =await userTokenStore.cacheToken("userId", getGetTokenResponse());
        expect(resp).toBe(JSON.stringify(getGetTokenResponse()));
        let readResp = await userTokenStore.getToken("userId");
        expect(readResp).toStrictEqual(getGetTokenResponse());
    })
})
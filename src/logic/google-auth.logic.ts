import fs from 'fs';
import { GetTokenResponse, TokenInfo } from 'google-auth-library/build/src/auth/oauth2client';
import * as google from 'googleapis';
import getEnv from '../helpers/dotenv.helper';
import GoogleSecrets from '../interfaces/google-secrets.interface';

export default class GoogleAuth {
    private credentials: GoogleSecrets;


    constructor(googleSecrets: string, private scopes: string[]) {
        this.credentials = JSON.parse(googleSecrets) as GoogleSecrets
    }

    private prepareOauth(redirectUri?: string): google.Auth.OAuth2Client {

        redirectUri = redirectUri === undefined ? this.credentials.web.redirect_uris[0] : redirectUri

        if (!this.credentials.web.redirect_uris.includes(redirectUri)) {
            throw new Error("Invalid redirect_url")
        }

        return new google.Auth.OAuth2Client({
            clientId: this.credentials.web.client_id,
            clientSecret: this.credentials.web.client_secret,
            redirectUri: redirectUri
        })
    }

    getAuthUrl(redirectUrl: string): string {
        return this.prepareOauth(redirectUrl).generateAuthUrl({
            access_type: 'offline',
            scope: this.scopes
        })
    }

    async getTokenInfo(tokenResponse: GetTokenResponse): Promise<TokenInfo> {
        let oauth = this.prepareOauth();
        oauth.credentials = tokenResponse.tokens

        if (!oauth.credentials.access_token) {
            throw new Error("No access token found!")
        }
        return oauth.getTokenInfo(oauth.credentials.access_token)

    }


    async getToken(code: string): Promise<GetTokenResponse> {

        let oauth = this.prepareOauth()

        try {
            let token = await oauth.getToken(code)
            console.log(token)
            return token
        }
        catch (e: any) {
            throw new Error(e.message)
        }
    }


}
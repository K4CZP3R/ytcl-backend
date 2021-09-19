import GoogleAuth from "./google-auth.logic"

describe('GoogleAuthLogic tests', () => {
    test('Construct without valid json throws SyntaxError', () => {
        expect(() => { new GoogleAuth("", []) }).toThrow(SyntaxError)
    })
    test('Construct with any json does nothing', () => {
        expect(() => { new GoogleAuth("{}", []) }).not.toThrow(SyntaxError)
    })

    test('getAuthUrl with empty credentials throws error', () => {
        let googleAuth = new GoogleAuth("{}", [])

        let thrownError

        try {
            googleAuth.getAuthUrl("https://myurl.com")
        }
        catch (e) {
            thrownError = e
        }
        expect(thrownError).not.toBeUndefined()
        expect((thrownError as Error).message).toContain("Cannot read property 'redirect_uris' of undefined")
    })

    test('getAuthUrl with invalid redirectUri throws error', () => {
        let fakeCredentials = {
            web: {
                redirect_uris: []
            }
        }

        let googleAuth = new GoogleAuth(JSON.stringify(fakeCredentials), [])
        let thrownError

        try {
            googleAuth.getAuthUrl("https://myurl.com")
        }
        catch (e) {
            thrownError = e as any
        }
        expect(thrownError).not.toBeUndefined()
        expect((thrownError as Error).message).toContain("Invalid redirect_url")
    })

    test('getAuthUrl with valid redirectUri returns url', () => {
        let fakeCredetnails = {
            web: {
                client_id: '',
                clientSecret: '',
                redirect_uris: ["https://myuri.com"]
            }
        }

        let googleAuth = new GoogleAuth(JSON.stringify(fakeCredetnails), [])
        let authUrl = googleAuth.getAuthUrl("https://myuri.com")
        expect(authUrl.startsWith("https://")).toBe(true)
    })

    test('getToken with valid code returns valid token', async () => {
        let fakeCredetnails = {
            web: {
                client_id: '',
                clientSecret: '',
                redirect_uris: ["https://myuri.com"]
            }
        }

        let googleAuth = new GoogleAuth(JSON.stringify(fakeCredetnails), [])
        let thrownError
        try {
            await googleAuth.getToken('123')
        }
        catch (e) {
            thrownError = e
        }

        expect(thrownError).not.toBeUndefined()
        expect((thrownError as Error).message).toContain("getToken failed!")
    })

})

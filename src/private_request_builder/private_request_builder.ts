import {API, Client} from "../client";
import {RequestBuilder} from "../request_builder/request_builder";
const fetch = require('node-fetch');

/**
 * Extends the RequestBuilder to allow authenticating with the NS client and accessing private shards.
 * No support for accessing private commands. Only shards.
 * @example const request = new PrivateRequestBuilder(api).authenticate('Testlandia', 'password');
 */
export class PrivateRequestBuilder extends RequestBuilder {
    public _authentication: Auth = {
        status: false,
    }

    constructor(api: API | Client) {
        super(api);
    }

    /**
     * Returns the authentication information as an object.
     */
    get authInfo(): Auth {
        return this._authentication;
    }

    /**
     * Retrieves the X-Pin value from NationStates and saves all information to the _authentication object.
     * Must be run before sending any requests.
     * @example const request = new PrivateRequestBuilder(api).authenticate('Testlandia', 'password');
     * @param {string} nation The nation to retrieve the X-Pin for.
     * @param {string} password The password for the nation.
     */
    public async authenticate(nation: string, password: string): Promise<PrivateRequestBuilder> {
        this._authentication._nation = nation;
        this._authentication._xPassword = password;
        const req = new PrivateRequestBuilder(this.client).addNation(nation).addShards('unread');
        await this.execRateLimit();
        try {
            let res = await fetch(req.href, {
                headers: {
                    'User-Agent': this.client.userAgent,
                    'X-Password': password
                }
            });
            await this.logRequest(res);
            this._authentication._xPin = res.headers.get('x-pin');
            this._authentication.status = true;
        } catch (err) {
            throw new Error(err);
        }
        return this;
    }

    /**
     * Executes the request and saves the response to the RequestBuilder object.
     * Retrieve after awaiting it via .response, .body, or convert it to a JS object with convertToJSON();
     * Polymorph of RequestBuilder.
     */
    public async execute(): Promise<PrivateRequestBuilder> {
        if (!this._authentication.status) {
            throw new Error('You must first authenticate! Run authenticate() on your private request before sending it.')
        }

        await this.execRateLimit();
        try {
            const res = await fetch(this.href, {
                headers: {
                    'User-Agent': this.client.userAgent,
                    'X-Pin': this._authentication._xPin,
                }
            });
            await this.logRequest(res);
        } catch (err) {
            throw new Error(`Error sending request: ${err}`);
        }
        return this;
    }
}

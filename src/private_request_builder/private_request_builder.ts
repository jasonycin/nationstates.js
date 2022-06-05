import {API, Client} from "../client";
import {RequestBuilder} from "../request_builder/request_builder";

/**
 * Extends the RequestBuilder to allow authenticating with the NS API and accessing private shards.
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
        // Set nation and password in authentication object, so that if the x-pin expires it can be re-retrieved.
        this._authentication._nation = nation;
        this._authentication._xPassword = password;

        // By using a seperate request builder, we avoid messing with the defined URL.
        const req = new PrivateRequestBuilder(this.API).addNation(nation).addShards('unread');

        // Check rate limit
        await this.execRateLimit();

        // Send request with a x-password header set.
        try {
            let res = await fetch(req.href, {
                headers: {
                    'User-Agent': this.API.userAgent,
                    'X-Password': password
                }
            });

            // Log request and update rate limit.
            await this.logRequest(res);

            // Return the x-pin header.
            this._authentication._xPin = res.headers.get('x-pin');
            this._authentication.status = true;

            // Error handling.
        } catch (err) {
            // Throw error.
            throw new Error(err);
        }

        // Method chaining.
        return this;
    }

    /**
     * Executes the request and saves the response to the RequestBuilder object.
     * Retrieve after awaiting it via .response, .body, or convert it to a JS object with convertToJSON();
     * Polymorph of RequestBuilder.
     */
    public async sendRequestAsync(): Promise<PrivateRequestBuilder> {
        // Verifies that the authentication object is set.
        if (!this._authentication.status) {
            throw new Error('You must first authenticate! Run authenticate() on your private request before sending it.')
        }

        // Check rate limit.
        await this.execRateLimit();

        // Send request
        try {
            // Send request.
            const res = await fetch(this.href, {
                headers: {
                    'User-Agent': this.API.userAgent,
                    'X-Pin': this._authentication._xPin,
                }
            });

            // Log request and update rate limit.
            await this.logRequest(res);

        } catch (err) {
            throw new Error(`Error sending request: ${err}`);
        }

        // Method chaining
        return this;
    }
}

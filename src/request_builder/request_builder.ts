import {API, Client} from "../client";
import {NationPublic} from "../enums/nation_public";
import {NationPrivate} from "../enums/nation_private";
import {RegionPublic} from "../enums/region_public";
import {World} from "../enums/world";
import {WorldAssembly} from "../enums/world_assembly";
import {Cards} from "../enums/cards";
import {IResponse} from "./interfaces/response";
import {CouncilID} from "../enums/council_id";
import {parseXml} from "../xml_parser";
const fetch = require('node-fetch');

/**
 * Build a request to your specifications! Usage:
 * - (1) Define the architecture of a https request before it sent to the client.
 * - (2) Access and modify the response of a request.
 * @example const request = await new RequestBuilder(api).addNation('testlandia').execute();
 * console.log(request.body);
 * @param {client} api - The client instance to use. Used to enforce the rate limit and user agent.
 */
export class RequestBuilder {
    protected client: Client;
    protected _urlObj: URL = new URL('https://www.nationstates.net/cgi-bin/api.cgi');
    protected _shards: string[] = [];
    public response: IResponse;

    constructor(client: API | Client) {
        /**
         * client is deprecated. Use Client instead.
         * TODO: Remove this in the future.
         */
        if (client instanceof API) {
            this.client = new Client(client.userAgent, client.rateLimit);
        } else if (client instanceof Client) {
            this.client = client;
        } else {
            throw new Error('Invalid client. Must be an instance of client or Client. client is deprecated!')
        }
    }

    /**
     * Returns full node-fetch request and other meta-data created by the client wrapper.
     * Typical usage would to analyze the request for any errors.
     * @example console.log(request.fetchResponse);
     */
    public get responseData(): IResponse {
        // Verify if response is undefined.
        if (!this.response) throw new Error('No response found. Send a request first using execute()!')

        return this.response;
    }

    /**
     * Returns the response status code and status boolean from the node-fetch response as an object.
     * @example console.log(request.responseStatus.statusCode);
     */
    public get responseStatus(): IResponseStatus {
        // Verify if response is undefined.
        if (!this.response) throw new Error('No response found. Send a request first using execute()!')

        return {
            code: this.response.statusCode,
            bool: this.response.statusBool
        };
    }


    /**
     * Returns the current body of the last node-fetch request associated with this instance.
     * @example console.log(request.body);
     */
    public get body(): string | number {
        // Verifies if a response has been received.
        if (!this.response) throw new Error('No body found. Have you sent and awaited your request via execute()?')

        // If the body is a number, convert the string to a number and return it, else return the body as is.
        return !isNaN(this.response.body) ? parseInt(this.response.body) : this.response.body;
    }

    /**
     * Returns the current JS object of the last node-fetch request associated with this instance.
     * You must convert the body to a JS object before using this method via convertBodyToJSON().
     * @example request.convertToJSON();
     * console.log(request.js);
     */
    public get js(): object {
        // Verify if the response has been converted to js.
        if (!this.response.js) throw new Error('No JSON found. Try toJS() first and make sure a request has been sent.')

        return this.response.js;
    }

    /**
     * Returns the current shards of a RequestBuilder object as a single string or as an array of strings.
     * @example console.log(request.shards);
     */
    public get shards(): string | string[] {
        // Verifies if shards have been added.
        if (!this._shards) throw new Error('No shards have been added.')

        // If there is only a single shard, return it.
        if (this._shards.length === 1) return this._shards[0];

        // Returns the array of shards.
        return this._shards;
    }

    /**
     * Builds and then returns the URL for which the request will be sent.
     * Serves the purpose of ensuring proper URL encoding.
     */
    public get href(): string {
        let url = this._urlObj.origin + this._urlObj.pathname + '?'; // https://www.nationstates.net/cgi-bin/api.cgi?.
        let params = [];
        this._urlObj.searchParams.forEach((value, key) => {
            if (key === 'q') params.push(`${key}=${decodeURIComponent(value)}`);
            else params.push(`${key}=${encodeURIComponent(value)}`);
        });
        return url + params.join('&');
    }

    /**
     * Adds the nation to the url parameters.
     * @example .addNation('Testlandia') adds 'nation=Testlandia' to the url.
     * @param name - The name of the nation from which data is retrieved.
     */
    public addNation(name: string): RequestBuilder {
        if (name.length < 3 ||
            !name.match(/^[\w\-\s]+$/) || // Must be alphanumeric, or only alpha, or only numeric
            name.slice(-1) === ' ' ||
            typeof (name) !== 'string') {
            throw new Error(`You submitted an invalid nation name: ${name}`);
        }
        this._urlObj.searchParams.append('nation', name);
        return this;
    }

    /**
     * Adds the region to the url parameters.
     * @example .addRegion('The South Pacific') adds 'region=The%20South%20Pacific' to the url.
     * @param name
     */
    public addRegion(name: string): RequestBuilder {
        this._urlObj.searchParams.append('region', name);
        return this;
    }

    /**
     * Adds a council ID to the url parameters.
     * @example .addCouncil(1) adds 'wa=1' to the url.
     * @param id
     */
    public addCouncilID(id: CouncilID | number): RequestBuilder {
        if (typeof (id) !== 'number') throw new Error(`You submitted an invalid council ID: ${id}. Must be a number.`);
        if (id > 2 || id < 0) throw new Error('Invalid ID. 1 = GA, 2 = SC.')
        this._urlObj.searchParams.append('wa', id.toString());
        return this;
    }

    /**
     * Adds a resolution ID to the url parameters.
     * @example .addResolutionID(22) adds 'id=22' to the url parameters.
     * @param id
     */
    public addResolutionID(id: number): RequestBuilder {
        if (typeof (id) !== 'number') throw new Error(`You submitted an invalid resolution ID: ${id}. Must be a number.`);
        this._urlObj.searchParams.append('id', id.toString());
        return this;
    }

    /**
     * Add shards to the url parameters after the 'q=' parameter.
     * @example .addShards('flag') adds 'q=Testlandia' to the url.
     * @example .addShards([ 'flag', 'population' ]) adds 'q=flag+population' to the url.
     * @param shards
     */
    public addShards(shards: NationPublic | NationPrivate | RegionPublic | World | WorldAssembly | Cards | string | string[]): RequestBuilder {
        switch (typeof (shards)) {
            case "string":
                this._shards.push(shards);
                break;
            case "object":
                shards.forEach(shard => this._shards.push(shard));
                break;
            default:
                throw new Error("Invalid type of _shards. Must be a string or an array of strings.");
        }

        if (this._urlObj.searchParams.has('q')) this._urlObj.searchParams.delete('q');
        this._urlObj.searchParams.append('q', this._shards.join('+'));
        return this;
    }

    /**
     * Appends the given parameters to the url with the defined key and value.
     * @example .addCustomParam('key', 'value') adds 'key=value' to the url.
     * @param key
     * @param value
     */
    public addCustomParam(key: string, value: string | number) {
        this._urlObj.searchParams.append(key.toString(), value.toString());
        return this;
    }

    /**
     * Removes all shards from the RequestBuilder object and its associated URL.
     * @example new RequestBuilder(api).addShards('numnations').removeShards()
     */
    public deleteAllShards(): void {
        this._urlObj.searchParams.delete('q');
        this._shards.length = 0;
    }

    /**
     * Enforces the rate-limit by calculating time-to-wait and then waiting for the specified amount of time.
     */
    protected async execRateLimit(): Promise<void> {
        const difference: number = Date.now() - this.client.lastRequestMs;
        if (this.client.rateLimit > difference) {
            const timeToWait: number = this.client.rateLimit - difference;
            // Forcefully stop JavaScript execution.
            await new Promise(resolve => setTimeout(resolve, timeToWait));
        }
    }

    /**
     * Executes the request and saves the response to the RequestBuilder object.
     * Retrieve after awaiting it via .response, .body, or convert it to a JS object with convertToJSON();
     * @example const req = await new RequestBuilder(api).addNation('Testlandia').execute()
     */
    public async execute(): Promise<RequestBuilder> {
        await this.execRateLimit();
        try {
            const res = await fetch(this.href, {
                headers: { 'User-Agent': this.client.userAgent }
            });
            await this.logRequest(res);
        } catch (err) {
            throw new Error(`Error sending request: ${err}`);
        }
        return this;
    }

    /**
     * ⚠️ Deprecated! Use execute() instead.
     */
    public async sendRequestAsync() {
        console.log('WARNING: sendRequestAsync() is deprecated. Use execute() instead.');
        await this.execute();
    }

    /**
     * Saves the node-fetch response to the response object within the instance.
     * @param res
     * @protected
     */
    protected async logRequest(res): Promise<void> {
        this.client.lastRequestMs = Date.now();
        this.response = {
            fetchResponse: res,
            unixTime: Date.now(),
            statusCode: res.status,
            statusBool: res.ok,
            body: await res.text()
        }
    }

    public async toJS(): Promise<RequestBuilder> {
        if (!this.response.body) throw new Error("No response body could be found. You can examine the response body by doing: ")
        try {
            this.response.js = await parseXml(this.response.body);
        }
        catch (err) {
            throw new Error(err);
        }
        return this;
    }

    /**
     * ⚠️ Deprecated! Use execute() instead.
     */
    public async convertToJSAsync() {
        console.log('WARNING: convertToJSAsync() is deprecated. Use execute() instead.');
        await this.toJS();
    }

    /**
     * Resets the url and shards to the default. Protected to allow extending into the NSMethods class.
     * End-users wishing to reset their URL should simply create a new RequestBuilder object instead.
     * @protected
     */
    protected resetURL(): RequestBuilder {
        this._urlObj = new URL('https://www.nationstates.net/cgi-bin/api.cgi');
        this._shards = [];
        return this;
    }
}

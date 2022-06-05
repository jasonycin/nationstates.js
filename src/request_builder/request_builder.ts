import {API, Client} from "../client";
import {NationPublic} from "../enums/nation_public";
import {NationPrivate} from "../enums/nation_private";
import {Region} from "../enums/region";
import {World} from "../enums/world";
import {WorldAssembly} from "../enums/world_assembly";
import {Cards} from "../enums/cards";
import {IResponse} from "./interfaces/response";
import {CouncilID} from "../enums/council_id";
import {xmlParser} from "../xml_parser";

/**
 * Build a request to your specifications! Usage:
 * - (1) Define the architecture of a https request before it sent to the API.
 * - (2) Access and modify the response of a request.
 * @example const request = await new RequestBuilder(api).addNation('testlandia').sendRequestAsync();
 * console.log(request.body);
 * @param {API} api - The API instance to use. Used to enforce the rate limit and user agent.
 */
export class RequestBuilder {
    protected API: Client;
    protected _urlObj: URL = new URL('https://www.nationstates.net/cgi-bin/api.cgi');
    protected _shards: string[] = [];
    protected _response: IResponse;

    constructor(client: API | Client) {
        if (client instanceof API) {
            this.API = new Client(client.userAgent, client.rateLimit);
        } else if (client instanceof Client) {
            this.API = client;
        } else {
            throw new Error('Invalid client. Must be an instance of API or Client. API is deprecated!')
        }

    }

    /**
     * Returns full node-fetch request and other meta-data created by the API wrapper.
     * Typical usage would to analyze the request for any errors.
     * @example console.log(request.fetchResponse);
     */
    public get responseData(): IResponse {
        // Verify if response is undefined.
        if (!this._response) throw new Error('No response found. Send a request first using sendRequestAsync()!')

        return this._response;
    }

    /**
     * Returns the response status code and status boolean from the node-fetch response as an object.
     * @example console.log(request.responseStatus.statusCode);
     */
    public get responseStatus(): IResponseStatus {
        // Verify if response is undefined.
        if (!this._response) throw new Error('No response found. Send a request first using sendRequestAsync()!')

        return {
            code: this._response.statusCode,
            bool: this._response.statusBool
        };
    }


    /**
     * Returns the current body of the last node-fetch request associated with this instance.
     * @example console.log(request.body);
     */
    public get body(): string | number {
        // Verifies if a response has been received.
        if (!this._response) throw new Error('No body found. Have you sent and awaited your request via sendRequestAsync()?')

        // If the body is a number, convert the string to a number and return it, else return the body as is.
        return !isNaN(this._response.body) ? parseInt(this._response.body) : this._response.body;
    }

    /**
     * Returns the current JS object of the last node-fetch request associated with this instance.
     * You must convert the body to a JS object before using this method via convertBodyToJSON().
     * @example request.convertToJSON();
     * console.log(request.js);
     */
    public get js(): object {
        // Verify if the response has been converted to js.
        if (!this._response.js) throw new Error('No JSON found. Try convertToJSAsync() first and make sure a request has been sent.')

        return this._response.js;
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
        // Base url: https://www.nationstates.net/cgi-bin/api.cgi
        let url = this._urlObj.origin + this._urlObj.pathname + '?';

        // Unless a query string, encode the shards.
        let params = [];
        this._urlObj.searchParams.forEach((value, key) => {
            if (key === 'q') {
                params.push(`${key}=${decodeURIComponent(value)}`);
            } else {
                params.push(`${key}=${encodeURIComponent(value)}`);
            }
        })

        // Return the url with the shards, which had been formatted above.
        return url + params.join('&');
    }

    /**
     * Adds the nation to the url parameters.
     * @example .addNation('Testlandia') adds 'nation=Testlandia' to the url.
     * @param name - The name of the nation from which data is retrieved.
     */
    public addNation(name: string): RequestBuilder {
        if (// Minimum length
            name.length < 3 ||
            // Must be alphanumeric, or only alpha, or only numeric
            !name.match(/^[\w\-\s]+$/) ||
            // Last character cannot be a space
            name.slice(-1) === ' ' ||
            // Data type is string.
            typeof (name) !== 'string')
            throw new Error(`You submitted an invalid nation name: ${name}`);

        // Append nation to the url.
        this._urlObj.searchParams.append('nation', name);

        // Method chaining.
        return this;
    }

    /**
     * Adds the region to the url parameters.
     * @example .addRegion('The South Pacific') adds 'region=The%20South%20Pacific' to the url.
     * @param name
     */
    public addRegion(name: string): RequestBuilder {
        // Append region to the url.
        this._urlObj.searchParams.append('region', name);

        // Method chaining.
        return this;
    }

    /**
     * Adds a council ID to the url parameters.
     * @example .addCouncil(1) adds 'wa=1' to the url.
     * @param id
     */
    public addCouncilID(id: CouncilID | number): RequestBuilder {
        // Type-checking
        if (typeof (id) !== 'number') throw new Error(`You submitted an invalid council ID: ${id}. Must be a number.`);

        // Verify if ID matches NationStates API specifications.
        if (id > 2 || id < 0) throw new Error('Invalid ID. 1 = GA, 2 = SC.')

        // Append to URL.
        this._urlObj.searchParams.append('wa', id.toString());

        // Method chaining.
        return this;
    }

    /**
     * Adds a resolution ID to the url parameters.
     * @example .addResolutionID(22) adds 'id=22' to the url parameters.
     * @param id
     */
    public addResolutionID(id: number): RequestBuilder {
        // Type-checking
        if (typeof (id) !== 'number') throw new Error(`You submitted an invalid resolution ID: ${id}. Must be a number.`);

        // Append to URL.
        this._urlObj.searchParams.append('id', id.toString());

        // Method chaining.
        return this;
    }

    /**
     * Add shards to the url parameters after the 'q=' parameter.
     * @example .addShards('flag') adds 'q=Testlandia' to the url.
     * @example .addShards([ 'flag', 'population' ]) adds 'q=flag+population' to the url.
     * @param shards
     */
    public addShards(shards: NationPublic | NationPrivate | Region | World | WorldAssembly | Cards | string | string[]): RequestBuilder {
        switch (typeof (shards)) {
            // If only a single shard is given, push it to _shards[].
            case "string":
                this._shards.push(shards);
                break;

            // If array of strings, then push each string to _shards[].
            case "object":
                // Iterate over each shard.
                for (let shard of shards)
                    this._shards.push(shard);
                break;

            // Error handling
            default:
                throw new Error("Invalid type of _shards. Must be a string or an array of strings.");
        }

        // Check if shards are already in the url. If yes, deletes them.
        if (this._urlObj.searchParams.has('q')) this._urlObj.searchParams.delete('q');

        // Add shards[] to URL.
        this._urlObj.searchParams.append('q', this._shards.join('+'));

        // Method chaining
        return this;
    }

    /**
     * Appends the given parameters to the url with the defined key and value.
     * @example .addCustomParam('key', 'value') adds 'key=value' to the url.
     * @param key
     * @param value
     */
    public addCustomParam(key: string, value: string | number) {
        // Append key and value to the url.
        this._urlObj.searchParams.append(key.toString(), value.toString());

        // Method chaining.
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
        // Get difference in milliseconds between the current date and the last request sent.
        const difference: number = Date.now() - this.API.lastRequestMs;

        // If the difference exceeds the rate limit, wait for the difference.
        if (this.API.rateLimit > difference) {
            // Calculate the time to wait.
            const timeToWait: number = this.API.rateLimit - difference;
            // Forcefully stop JavaScript execution.
            await new Promise(resolve => setTimeout(resolve, timeToWait));
        }
    }

    /**
     * Executes the request and saves the response to the RequestBuilder object.
     * Retrieve after awaiting it via .response, .body, or convert it to a JS object with convertToJSON();
     * @example const req = await new RequestBuilder(api).addNation('Testlandia').sendRequestAsync()
     */
    public async sendRequestAsync(): Promise<RequestBuilder> {
        // Check rate limit.
        await this.execRateLimit();

        try {
            // Send request.
            const res = await fetch(this.href, {
                headers: {
                    'User-Agent': this.API.userAgent,
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

    /**
     * Saves the node-fetch response to the _response object within the instance.
     * @param res
     * @protected
     */
    protected async logRequest(res): Promise<void> {
        // Record the unix timestamp of the request for rate limiting.
        this.API.lastRequestMs = Date.now();

        // Handle IResponse
        this._response = {
            fetchResponse: res,
            unixTime: Date.now(),
            statusCode: res.status,
            statusBool: res.ok,
            body: await res.text()
        }
    }

    public async convertToJSAsync(): Promise<RequestBuilder> {
        // Verifies if the a response has been set.
        if (!this._response.body) throw new Error("No response body could be found. You can examine the response body by doing: ")

        // Attempts to parse the XML into a JSON object.
        try {
            this._response.js = await this.parseXml(this._response.body);
        }
        catch (err) {
            throw new Error(err);
        }

        // Method chaining.
        return this;
    }

    /**
     * Parses XML into a JSON object.
     * @author The xmLParser is based on the following written by Auralia:
     * https://github.com/auralia/node-nsapi/blob/master/src/api.ts#L25
     * @param {string} xml The XML to parse.
     * @return data promise returning a JSON object.
     */
    protected parseXml(xml: string): Promise<object> {
        return new Promise((resolve, reject) => {
            xmlParser.parseString(xml, (err: any, data: any) => {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });
    }

    /**
     * Resets the url and shards to the default. Protected to allow extending into the NSMethods class.
     * End-users wishing to reset their URL should simply create a new RequestBuilder object instead.
     * @protected
     */
    protected resetURL(): RequestBuilder {
        // Resets the URL to the default.
        this._urlObj = new URL('https://www.nationstates.net/cgi-bin/api.cgi');

        // Empty the query string by overwriting the shards with an empty array.
        this._shards = [];

        // Method chaining
        return this;
    }
}

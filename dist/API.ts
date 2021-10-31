// Node-fetch v.2.6.5. Supported by developers.
import { Headers } from 'node-fetch';
import fetch from 'node-fetch';
// Filesystem
import * as fs from "fs";
// Xml2js v.0.4.23
import * as xml2js from 'xml2js';

/**
 * Defines the structure of the _authentication object in the API class.
 */
interface Auth {
    status: boolean,
    _xPassword?: string,
    _xAutoLogin?: string,
    _xPin?: number
}

/**
 * Required for all other classes. Defines the configuration of the library and is used to enforce rate limits and user agents.
 */
export class API {
    static readonly version: string = '0.0.1-alpha';
    private _userAgent: string;
    private _rateLimit: number = 650;
    private static _lastRequestMs: number;
    public _authentication: Auth = {
        status: false,
    }

    /**
     * Instance must be instantiated with a user agent string. Setting a custom rate limit is optional.
     * @param {string} userAgent
     * @param {number} rateLimit
     */
    constructor(userAgent: string, rateLimit?: number) {
        this.userAgent = userAgent; // Uses setter

        // If optional rate limit parameter was input.
        if (rateLimit) {
            // Uses setter if optional parameter was input.
            this.rateLimit = rateLimit;
        }
    }

    /**
     * Retrieves the user agent string.
     */
    get userAgent(): string {
        return this._userAgent;
    }

    /**
     * Sets the user agent. Verifies the parameter length if less than three, is alphanumeric,
     * does not end in an empty space, and is a string.
     * @param {string} userAgent
     */
    set userAgent(userAgent: string) {
        if (// Minimum length
            userAgent.length < 3 ||
            // Must be alphanumeric, or only alpha, or only numeric
            !userAgent.match(/^([0-9]|[a-z])+([0-9a-z]+)$/i) ||
            // Last character cannot be a space
            userAgent.slice(-1) === ' ' ||
            // Data type is string.
            typeof (userAgent) !== 'string') {
                // Throw error.
                throw new Error(`You submitted an invalid user agent: ${userAgent}`);
        }
        // Set user agent.
        this._userAgent = `User-Agent: ${userAgent}. Using API wrapper written by Heaveria.`;
    }

    /**
     * Returns the current rate limit as a string.
     */
    get rateLimit(): number {
        return this._rateLimit;
    }

    /**
     * Set the rateLimit of the instance. Verifies that the input is a number and is >= 650.
     * @param {number} ms - The number of milliseconds to set the rateLimit to.
     */
    set rateLimit(ms: number) {
        // Check minimum rate limit and data type.
        if (ms < 650 || typeof (ms) !== 'number') {
            // If true, throw error.
            throw new Error(`You submitted an invalid rate limit: ${ms}ms. Must be equal to or higher than 650.`);
        }
        // Set rate limit.
        this._rateLimit = ms;
    }

    /**
     * Returns the last request time in milliseconds.
     */
    public get lastRequestMs(): number {
        // Verify is the property has been set.
        //if (!API._lastRequestMs) {
            // Throw error.
            //throw new Error('You have not made a request yet.');
        //}
        // Return the last request time.
        return API._lastRequestMs;
    }

    /**
     * Set the time of the last request in milliseconds.
     * @example api.lastRequestMs = Date.now();
     * @param ms
     */
    set lastRequestMs(ms: number) {
        // Data type checking and value checking
        if (typeof (ms) !== 'number' || ms <= 0) {
            // Throw Error
            throw new Error('Parameter must be a number.')
        }
        // Set the last request time.
        API._lastRequestMs = ms;
    }

    public async authenticate(nation: string, password: string) {
        this._authentication._xPin =
            await new RequestBuilder(this)
            .addNation(nation)
            .addShards('unread')
            .getXPin(password)
        this._authentication.status = true;
    }
}

/*---------------------------------------------*/

/**
 * @author The xmLParser is based on the following written by Auralia:
 * https://github.com/auralia/node-nsapi/blob/master/src/api.ts#L25
 * @hidden
 */
const xmlParser = new xml2js.Parser({
    charkey: "value",
    trim: true,
    normalizeTags: true,
    normalize: true,
    explicitRoot: false,
    explicitArray: false,
    mergeAttrs: true,
    attrValueProcessors: [(value: any) => {
        let num = Number(value);
        if (!isNaN(num)) {
            return num;
        } else {
            return value;
        }
    }],
    valueProcessors: [(value: any) => {
        let num = Number(value);
        if (!isNaN(num)) {
            return num;
        } else {
            return value;
        }
    }]
});

/**
 * Defines the layout of the response object in a RequestBuilder object.
 * @interface
 */
export interface Response {
    fetchResponse: any,
    unixTime: number,
    statusCode: number,
    statusBool: boolean,
    body: any,
    error?: string,
    json?: any
}

/**
 * A object that is used to:
 * - (1) Define the architecture of a https request before it sent to the API.
 * - (2) Access and modify the response of a request.
 * @class
 * @example let request = await new RequestBuilder(api).addNation('testlandia').sendRequestAsync();
 */
export class RequestBuilder {
    protected API: API;
    public _url: URL = new URL('https://www.nationstates.net/cgi-bin/api.cgi');
    protected _headers: Headers = new Headers();
    protected _shards: string[] = [];
    _response: Response;

    constructor(API: API) {
        this.API = API;
        this._headers.set('User-Agent', this.API.userAgent);
    }

    get headers(): any {
        let headers = {
            'User-Agent': this.API.userAgent
        };

        if (this.API._authentication.status) {
            headers['X-Pin'] = this.API._authentication._xPin;
        }

        return headers;
    }


    /**
     * Returns the current body located in the response of a RequestBuilder object.
     */
    public get body(): string | number | boolean | object {
        // Verifies if a response has been recieved.
        if (!this._response) {
            throw new Error('No body found. Have you sent and awaited your request via sendRequestAsync()?')
        }

        // If the body is a number, convert the string to a number and return it. Else returns the body as is.
        return !isNaN(this._response.body) ? this._response.body : parseInt(this._response.body);
    }

    /**
     * Returns the current JSON located in the response of a RequestBuilder object.
     * A conversion to JSON beforehand is required.
     * @example (1) let request = await new RequestBuilder(api).addNation('testlandia').sendRequestAsync();
     * (2) request.convertToJSON();
     * (3) console.log(request.json);
     */
    public get json(): object {
        if (!this._response.json) {
            throw new Error('No JSON found. Try convertToJsonAsync() first.')
        }
        return this._response.json;
    }

    /**
     * Returns the current shards of a RequestBuilder object as a single string or as an array of strings.
     */
    public get shards(): string | string[] {
        // Verifies if shards have been added.
        if (!this._shards) {
            throw new Error('No shards have been added.')
        }

        // If there is only a single shard, return it.
        if (this._shards.length === 1) {
            return this._shards[0];
        }

        // Returns the array of shards.
        return this._shards;
    }

    /**
     * Adds the nation to the url parameters.
     * @example addNation('Testlandia') adds 'nation=Testlandia' to the url.
     * @param name - The name of the nation from which data is retrieved.
     */
    public addNation(name: string) {
        if (// Minimum length
            name.length < 3 ||
            // Must be alphanumeric, or only alpha, or only numeric
            !name.match(/^([0-9]|[a-z])+([0-9a-z]+)$/i) ||
            // Last character cannot be a space
            name.slice(-1) === ' ' ||
            // Data type is string.
            typeof (name) !== 'string') {
                throw new Error(`You submitted an invalid nation name: ${name}`);
        }
        this._url.searchParams.append('nation', name);
        // Method chaining.
        return this;
    }

    public addRegion(name: string) {
        this._url.searchParams.append('region', name);
        // Method chaining.
        return this;
    }

    public addCouncilID(id: number) {
        if (id > 2 || id < 0) {
            throw new Error('Invalid ID. 1 = GA, 2 = SC.')
        }
        this._url.searchParams.append('wa', id.toString());
        // Method chaining.
        return this;
    }

    public addShards(shards: string | string[]): RequestBuilder {
        switch (typeof (shards)) {
            // If only a single shard is given, push it to the class _shards[].
            case "string":
                this._shards.push(shards);
                break;
            // If array of strings, then push each string to the class _shards[].
            case "object":
                // Iterate over each shard.
                for (let shard of shards) {
                    this._shards.push(shard);
                }
                break;
            // Error handling
            default:
                throw new Error("Invalid type of _shards. Must be a string or an array of strings.");
        }

        // Check if shards are already in the url. If yes, deletes them.
        if (this._url.searchParams.has('q')) {
            this._url.searchParams.delete('q');
        }

        // Add shards[] to URL.
        this._url.searchParams.append('q', this._shards.join('+'));
        // Method chaining
        return this;
    }

    /**
     * Removes all shards from the RequestBuilder object and its associated URL.
     * @example new RequestBuilder(api).addShards('numnations').removeShards()
     */
    public deleteAllShards(): void {
        this._url.searchParams.delete('q');
        this._shards.length = 0;
    }

    public async execRateLimit(): Promise<void> {
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
     * Download the nation data dump from the API.
     * @example await new Request(API).downloadNationDumpAsync('./{FILENAME}.xml.gz');
     * @param pathToSaveFile
     */
    public async downloadNationDumpAsync(pathToSaveFile: string): Promise<this> {
        // Check rate limit.
        await this.execRateLimit();
        const res = await fetch('https://www.nationstates.net/pages/nations.xml.gz', {
            headers: {
                'User-Agent': this.API.userAgent
            }
        });
        const fileStream = fs.createWriteStream(pathToSaveFile);
        await new Promise((resolve, reject) => {
            res.body.pipe(fileStream);
            res.body.on("error", reject);
            fileStream.on("finish", resolve);
        });
        return this;
    }

    /**
     * Download the regions data dump from the API.
     * @example await new Request(API).downloadRegionDumpAsync('./{FILENAME}.xml.gz');
     * @param pathToSaveFile
     */
    public async downloadRegionDumpAsync(pathToSaveFile: string): Promise<this> {
        // Check rate limit.
        await this.execRateLimit();
        const res = await fetch('https://www.nationstates.net/pages/regions.xml.gz', {
            headers: {
                'User-Agent': this.API.userAgent
            }
        });
        const fileStream = fs.createWriteStream(pathToSaveFile);
        await new Promise((resolve, reject) => {
            res.body.pipe(fileStream);
            res.body.on("error", reject);
            fileStream.on("finish", resolve);
        });
        return this;
    }

    public async sendRequestAsync(): Promise<RequestBuilder> {
        // Check rate limit.
        await this.execRateLimit();

        try {
            // Send request.
            const res = await fetch(this._url.href, {
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

    private async logRequest(res): Promise<void> {
        // Record the unix timestamp of the request for rate limiting.
        this.API.lastRequestMs = Date.now();
        // Handle Response
        this._response = {
            fetchResponse: res,
            unixTime: Date.now(),
            statusCode: res.status,
            statusBool: res.ok,
            body: await res.text()
        }
    }

    public getJSON(): any {
        if (!this._response.json) {
            throw new Error('No JSON found. Try convertToJsonAsync() first.')
        }
        return this._response.json;
    }

    public async convertToJsonAsync(): Promise<RequestBuilder> {
        // Verifies if the a response has been set.
        if (!this._response.body) {
            throw new Error("No response body could be found. You can examine the response body by doing: ")
        }

        // Attempts to parse the XML into a JSON object.
        try {
            this._response.json = await this.parseXml(this._response.body);
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
    private parseXml(xml: string): Promise<object> {
        return new Promise((resolve, reject) => {
            xmlParser.parseString(xml, (err: any, data: any) => {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });
    }

    async getXPin(password: string): Promise<number> {
        // Add password to headers.
        this._headers.append('X-Password', password);
        console.log(JSON.stringify(this.headers))
        // Send request with a x-password header set.
        try {
            let res = await fetch(this._url.href, {
                headers: JSON.stringify(this.headers)
            });
            // Log request and update rate limit.
            await this.logRequest(res);
            // Return the x-pin header.
            return res.headers.get('x-pin');
        // Error handling.
        } catch (err) {
            // Remove the wrong password from the headers.
            this._headers.delete('X-Password');
            // Throw error.
            throw new Error(err);
        }
    }

    protected resetURL(): RequestBuilder {
        this._url = new URL('https://www.nationstates.net/cgi-bin/api.cgi');
        this._shards = [];

        // Method chaning
        return this;
    }
}

/**
 * As opposed to building requests manually, this class has built-in methods for easily accessing and handling
 * common information one looks for. You do not build, send, or parse requests manually.
 * @param { API } API The API object to enforce rate limiting and user agents.
 */
export class NSFunctions extends RequestBuilder {

    constructor(api: API) {
        super(api);
    }

    /**
     * Returns a boolean response, if nation1 is endorsing nation2.
     * Does not modify the URL of the request.
     * @param nation1 - The nation to check if it is endorsing nation2.
     * @param nation2
     */
    async isEndorsing(nation1: string, nation2: string): Promise<boolean> {
        // Get endorsements of nation2.
        const r = await (await this
            .addNation(nation2)
            .addShards('endorsements')
            .sendRequestAsync())
            .convertToJsonAsync();

        // Extract endorsements from JObject response and convert them into an array.
        const endorsements: string[] = r.json['endorsements'].split(',');

        // Check if nation1 is endorsed by nation2.
        for (let nation of endorsements) {
            // Return true if nation1 is endorsed by nation2.
            if (nation === nation1) {
                this.resetURL();
                return true;
            }
        }

        this.resetURL();
        // If nation1 is not endorsed by nation2, return false.
        return false;
    }

    /**
     * Use the NS Verification API to verify the validity of a verifcation code.
     * Returns either a 0 or 1 as a number, as described in the NS API documentation.
     * @param nation
     * @param checksum
     */
    public async verify(nation: string, checksum: string): Promise<number> {
        // Add nation
        this.addNation(nation);
        // Adds "a=verify" to the URL parameters.
        this._url.searchParams.append('a', 'verify');
        // Adds
        this._url.searchParams.append('checksum', checksum);
        // Get response
        await this.sendRequestAsync();
        // Return response as number.
        return parseInt(this._response.body);
    }
}

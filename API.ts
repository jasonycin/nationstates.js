// Node-fetch v.2.6.5. Still supported by developers.
import fetch from 'node-fetch';
import { Headers } from 'node-fetch';
// Filesystem
import * as fs from "fs";
// Xml2js v.0.4.23
import * as xml2js from 'xml2js';
// Zlib
import * as zlib from 'zlib';

/**
 * Required for all other classes. Defines the configuration of the wrapper and is used to enforce rate limits and user agents.
 * @example const api = new API('Testlandia');
 */
export class API {
    static readonly version: string = '1.0.0';
    private _userAgent: string;
    private _rateLimit: number = 650;
    private static _lastRequestMs: number;

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
     * @example console.log(api.userAgent);
     */
    get userAgent(): string {
        return this._userAgent;
    }

    /**
     * Sets the user agent. Verifies the parameter length if less than three, is alphanumeric,
     * does not end in an empty space, and is a string.
     * @example api.userAgent = 'Testlandia';
     * @param {string} userAgent
     */
    set userAgent(userAgent: string) {
        userAgent = userAgent.trim();

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
     * Returns the current rate limit as a number.
     * @example console.log(api.rateLimit);
     */
    get rateLimit(): number {
        return this._rateLimit;
    }

    /**
     * Set the rateLimit of the instance. Verifies that the input is a number and is >= 650.
     * @example api.rateLimit = 1500;
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
     * Returns the last request time in milliseconds. Used to enforce rate limits.
     * @example console.log(api.lastRequestMs);
     */
    public get lastRequestMs(): number {
        return API._lastRequestMs;
    }

    /**
     * ❌⚠️ DO NOT USE unless you kow what you're doing.
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
}

/*---------------------------------------------*/

/**
 * @author The xmLParser is based on the following written by Auralia:
 * https://github.com/auralia/node-nsapi/blob/master/src/api.ts#L25
 * @hidden
 */
export const xmlParser = new xml2js.Parser({
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
 * Enumerator for the different types WA API calls. See addCouncilID() for usage.
 */
export enum CouncilID {
    GeneralAssembly = 1,
    SecurityCouncil = 2
}

/*------------Request Builder---------------------*/

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
    js?: any
}

/**
 * Build a request to your specifications! Usage:
 * - (1) Define the architecture of a https request before it sent to the API.
 * - (2) Access and modify the response of a request.
 * @example const request = await new RequestBuilder(api).addNation('testlandia').sendRequestAsync();
 * console.log(request.body);
 * @param {API} api - The API instance to use. Used to enforce the rate limit and user agent.
 */
export class RequestBuilder {
    protected API: API;
    public _url: URL = new URL('https://www.nationstates.net/cgi-bin/api.cgi');
    protected _shards: string[] = [];
    _response: Response;

    constructor(API: API) {
        this.API = API;
    }

    /**
     * Returns full node-fetch request and other meta-data created by the API wrapper.
     * Not needed unless you need to do something specific with the request.
     * @example console.log(request.fetchResponse);
     */
    public get response(): Response {
        // Verify if response is undefined.
        if (!this._response) {
            throw new Error('No response found. Send a request first using sendRequestAsync()!')
        }

        return this._response;
    }


    /**
     * Returns the current body of the last node-fetch request associated with this instance.
     * @example console.log(request.body);
     */
    public get body(): string | number {
        // Verifies if a response has been recieved.
        if (!this._response) {
            throw new Error('No body found. Have you sent and awaited your request via sendRequestAsync()?')
        }

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
        if (!this._response.js) {
            throw new Error('No JSON found. Try convertToJSAsync() first and make sure a request has been sent..')
        }

        return this._response.js;
    }

    /**
     * Returns the current shards of a RequestBuilder object as a single string or as an array of strings.
     * @example console.log(request.shards);
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
     * @example .addNation('Testlandia') adds 'nation=Testlandia' to the url.
     * @param name - The name of the nation from which data is retrieved.
     */
    public addNation(name: string): RequestBuilder {
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

        // Append nation to the url.
        this._url.searchParams.append('nation', name);

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
        this._url.searchParams.append('region', name);

        // Method chaining.
        return this;
    }

    /**
     * Adds a council ID to the url parameters.
     * @example .addCouncil(1) adds 'wa=1' to the url.
     * @param id
     */
    public addCouncilID(id: CouncilID): RequestBuilder {
        // Type-checking
        if (typeof (id) !== 'number') {
            throw new Error(`You submitted an invalid council ID: ${id}. Must be a number.`);
        }

        // Verify if ID matches NationStates API specifications.
        if (id > 2 || id < 0) {
            throw new Error('Invalid ID. 1 = GA, 2 = SC.')
        }

        // Append to URL.
        this._url.searchParams.append('wa', id.toString());

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
        if (typeof (id) !== 'number') {
            throw new Error(`You submitted an invalid resolution ID: ${id}. Must be a number.`);
        }

        // Append to URL.
        this._url.searchParams.append('id', id.toString());

        // Method chaining.
        return this;
    }

    /**
     * Add shards to the url parameters after the 'q=' parameter.
     * @example .addShards('flag') adds 'q=Testlandia' to the url.
     * @example .addShards([ 'flag', 'population' ]) adds 'q=flag+population' to the url.
     * @param shards
     */
    public addShards(shards: string | string[]): RequestBuilder {
        switch (typeof (shards)) {
            // If only a single shard is given, push it to _shards[].
            case "string":
                this._shards.push(shards);
                break;
            // If array of strings, then push each string to _shards[].
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
     * Appends the given parameters to the url with the defined key and value.
     * @example .addCustomParam('key', 'value') adds 'key=value' to the url.
     * @param key
     * @param value
     */
    public addCustomParam(key: string, value: string | number) {
        // Append key and value to the url.
        this._url.searchParams.append(key.toString(), value.toString());

        // Method chaining.
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

    /**
     * Saves the node-fetch response to the _response object within the instance.
     * @param res
     * @protected
     */
    protected async logRequest(res): Promise<void> {
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

    public async convertToJSAsync(): Promise<RequestBuilder> {
        // Verifies if the a response has been set.
        if (!this._response.body) {
            throw new Error("No response body could be found. You can examine the response body by doing: ")
        }

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
        this._url = new URL('https://www.nationstates.net/cgi-bin/api.cgi');

        // Empty the query string by overwriting the shards with an empty array.
        this._shards = [];

        // Method chaining
        return this;
    }
}

/*----------PrivateRequestBuilder----------*/

/**
 * Defines the structure of the _authentication object in the API class.
 * @interface
 */
export interface AuthObj {
    status: boolean,
    _nation?: string,
    _xPassword?: string,
    _xAutoLogin?: string,
    _xPin?: number
}

/**
 * Extends the RequestBuilder to allow authenticating with the NS API and accessing private shards.
 * No support for accessing private commands. Only shards.
 * @example const request = new PrivateRequestBuilder(api).authenticate('Testlandia', 'password');
 */
export class PrivateRequestBuilder extends RequestBuilder {
    public _authentication: AuthObj = {
        status: false,
    }

    constructor(api: API) {
        super(api);
    }

    /**
     * Returns the authentication information as an object.
     */
    get authInfo(): AuthObj {
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


        // Retrieve x-pin.
        this.addNation(nation).addShards('unread');

        try {
            this._authentication._xPin = await this.getXPin(password);
            this._authentication.status = true;
        } catch (e) {
            throw new Error(e);
        }


        // Since we modified the URL when retrieving the x-pin, we will reset it.
        this.resetURL();

        // Method chaining.
        return this;
    }

    /**
     * Sends a request to the NationStates API and returns the x-pin header from the response.
     * @param password
     */
    private async getXPin(password: string): Promise<number> {
        // Check rate limit
        await this.execRateLimit();
        // Send request with a x-password header set.
        try {
            let res = await fetch(this._url.href, {
                headers: {
                    'User-Agent': this.API.userAgent,
                    'X-Password': password
                }
            });
            // Log request and update rate limit.
            await this.logRequest(res);
            // Return the x-pin header.
            return res.headers.get('x-pin');
            // Error handling.
        } catch (err) {
            // Throw error.
            throw new Error(err);
        }
    }

    /**
     * Executes the request and saves the response to the RequestBuilder object.
     * Retrieve after awaiting it via .response, .body, or convert it to a JS object with convertToJSON();
     * Polymorph of RequestBuilder.
     * @example const req = await new RequestBuilder(api).addNation('Testlandia').sendRequestAsync()
     */
    public async sendRequestAsync(): Promise<RequestBuilder> {
        // Verifies that the authentication object is set.
        if (!this._authentication.status) {
            throw new Error('You must first authenticate! Run authenticate() on your private request before sending it.')
        }

        // Check rate limit.
        await this.execRateLimit();

        // Send request
        try {
            // Send request.
            const res = await fetch(this._url.href, {
                headers: {
                    'User-Agent': this.API.userAgent,
                    'X-Pin': this._authentication._xPin.toString()
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

/*-------------NSMethods-------------*/

/**
 * Defines the options for downloading dumps and what to do with them.
 */
export interface DumpOptions {
    extract?: boolean;
    deleteXMLGz?: boolean;
    deleteXML?: boolean;
    convertToJson?: boolean;
}

/**
 * As opposed to building requests manually, this class has built-in methods for easily accessing and handling
 * common information one looks for. You do not build, send, or parse requests manually.
 * @example const methods = new NSMethods(api);
 * @param { API } API The API object to enforce rate limiting and user agents.
 */
export class NSMethods extends RequestBuilder {
    constructor(api: API) {
        super(api);
    }

    /**
     * Returns a boolean response, if nation1 is endorsing nation2.
     * Does not modify the URL of the request.
     * @example console.log(await methods.isEndorsing('Testlandia', 'Testlandia')); // false
     * @param nation1 - The endorser.
     * @param nation2 - The endorsee.
     */
    async isEndorsing(nation1: string, nation2: string): Promise<boolean> {
        // Reset the object's URL.
        this.resetURL();

        // Get endorsements of nation2.
        const r = await (await this
            .addNation(nation2)
            .addShards('endorsements')
            .sendRequestAsync())
            .convertToJSAsync();

        // Extract endorsements from JObject response and convert them into an array.
        const endorsements: string[] = r.js['endorsements'].split(',');

        // Check if nation1 is endorsed by nation2.
        for (let nation of endorsements) {
            // Return true if nation1 is endorsed by nation2.
            if (nation === nation1) {
                this.resetURL();
                return true;
            }
        }
        // If nation1 is not endorsed by nation2, return false.
        return false;
    }

    /**
     * Use the NS Verification API to verify the validity of a verification code.
     * Returns either a 0 or 1 as a number, as described in the NS API documentation.
     * @example console.log(await methods.verify('Testlandia', '12345')); // 0
     * @param nation
     * @param checksum
     */
    public async verify(nation: string, checksum: string): Promise<number> {
        // Reset the object's URL.
        this.resetURL();
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


    /**
     * Download the nation data dump from the API.
     * Note that it can take a while to download the dump, especially for nations or when converting to JSON.
     * Future feature: Decode utf-8 within the dump.
     * @example methods.downloadDump('Testlandia', {extract: true, deleteXMLGz: true, deleteXML: true, convertToJson: true}); // Returns just a .json file
     * @param type -  Either 'nation' or 'region'
     * @param directoryToSave - The directory to save the dump to. Should be ended by a slash. Ex: "./downloads/"
     * @param options - If left blank, just downloads the {type}.xml.gz file.
     */
    public async downloadDumpAsync(type: string, directoryToSave: string, options?: DumpOptions): Promise<NSMethods> {
        // TODO: Implement decoding utf-8 within the dump.
        // Verify if type is correct
        if (type !== 'nations' && type !== 'regions') {
            throw new Error('Type must be either "nation" or "region"');
        }

        // Get current date as YYYY-MM-DD
        const currentDate = new Date().toISOString().slice(0, 10);

        // Set fileName with directory
        const fileName = directoryToSave + type + '.' + currentDate;

        // Check rate limit.
        await this.execRateLimit();

        // Request the file from the NationStates API.
        const res = await fetch(`https://www.nationstates.net/pages/${type}.xml.gz`, {
            headers: {
                'User-Agent': this.API.userAgent
            }
        });

        // Create a file stream to save the file.
        const fileStream = fs.createWriteStream(fileName + '.xml.gz');
        // Synchronously write the file to the file stream.
        await new Promise((resolve, reject) => {
            res.body.pipe(fileStream);
            res.body.on("error", reject);
            fileStream.on("finish", resolve);
        });

        if (options?.extract) {
            // Extract the file to XML.
            await this.gunzip(fileName + '.xml.gz', fileName + '.xml');
        }

        if (options?.convertToJson) {
            // Verify the XML file has been unzipped. If not, do so.
            if (!fs.existsSync(fileName + '.xml')) {
                await this.gunzip(fileName + '.xml.gz', fileName + '.xml');
            }

            // Convert the XML file to JSON.
            await this.xmlToJson(fileName + '.xml', fileName + '.json');
        }

        if (options?.deleteXMLGz) {
            // Delete the original xml.gz file.
            fs.unlinkSync(fileName +  '.xml.gz');
        }

        if (options?.deleteXML) {
            // Delete the unzipped .xml file.
            fs.unlinkSync(fileName +  '.xml');
        }

        // Method chaining
        return this;
    }

    /**
     * Extracts a gzipped file.
     * @param file
     * @param savePath
     * @private
     */
    private async gunzip(file: string, savePath: string): Promise<NSMethods> {
        // Decompress the gzip file.
        await new Promise((resolve) => {
            zlib.gunzip(fs.readFileSync(file), (err, buffer) => {
                fs.writeFileSync(savePath, buffer);
                resolve('Finished unzipping.');
            })
        });
        // Method chaining
        return this;
    }

    /**
     * Converts an XML file to JSON and saves it to the specified path.
     * Uses the XML2Js library.
     * @param file
     * @param savePath
     * @private
     */
    private async xmlToJson(file: string, savePath: string): Promise<NSMethods> {
        // Convert the XML file to JSON.
        let xml = fs.readFileSync(file, 'utf8');

        // Create JSON file
        const json = fs.createWriteStream(savePath);
        // Write JSON to file
        json.write(JSON.stringify(await this.parseXml(xml)));

        // Method Chaining
        return this;
    }
}

/**
 * @hidden
 */
export enum DispatchMode {
    add = 'add',
    remove = 'remove',
    edit = 'edit'
}

/**
 * Future support for dispatch private commands.
 */
export class Dispatch extends RequestBuilder {
    private readonly nation: string;
    private readonly password: string;
    private xPin: number;

    constructor(api: API, nation: string, password: string, action: string) {
        super(api);
        this.nation = nation;
        this.password = password;
        this.addNation(this.nation).addCustomParam('c', 'dispatch');
        this.addAction(action);
    }

    /**
     * Set the dispatch mode. It can be either:
     * - 'add'
     * - 'remove'
     * - 'edit'<br><br>
     * See NationStates API documentation for more information.
     * @param method
     */
    private addAction(method: string): Boolean | Error {
        if (typeof method !== 'string') {
            throw new Error('Action must be a string.');
        }

        // Standardize
        method = method.toLowerCase().trim();

        // Only allow add, remove, and edit.
        let result: boolean = false;
        if (method === 'add') { result = true; }
        if (method === 'remove') { result = true; }
        if (method === 'edit') { result = true; }

        if (result) {
            this._url.searchParams.append('dispatch', method);
            return;
        }

        // Otherwise, throw an error.
        throw new Error('You specified an incorrect dispatch method. Add, remove, or edit is valid.')
    }

    /**
     * Add title to the dispatch.
     * @param text
     */
    public title(text: string) {
        // Type-checking
        if (typeof text !== 'string') {
            throw new Error('The title must be a string.');
        }

        // Append to URL.
        this._url.searchParams.append('title', text)

        // Method Chaining
        return this;
    }

    /**
     * Add text to the dispatch.
     * @param text
     */
    public text(text: string) {
        // Type-checking
        if (typeof text !== 'string') {
            throw new Error('The text must be a string.');
        }

        // Append to URL.
        this._url.searchParams.append('text', text)

        // Method Chaining
        return this;
    }

    /**
     * Set the category of the dispatch.
     * @param category
     */
    public category(category: number) {
        // Type-checking
        if (typeof (category) !== 'number') {
            throw new Error('The category must be a number. See NationStates API documentation.')
        }

        // Set the category
        this._url.searchParams.append('category', category.toString());

        // Method chaining
        return this;
    }

    /**
     * Set the category of the dispatch.
     * @param subcategory
     */
    public subcategory(subcategory: number) {
        // Type-checking
        if (typeof (subcategory) !== 'number') {
            throw new Error('The category must be a number. See NationStates API documentation.')
        }

        // Set the category
        this._url.searchParams.append('subcategory', subcategory.toString());

        // Method chaining
        return this;
    }

    /**
     * Set the dispatch ID when editing or a removing a dispatch.
     * @param id
     */
    public dispatchID(id: number) {
        // Type-checking
        if (typeof (id) !== 'number') {
            throw new Error('The dispatch ID must be a number.')
        }

        // Verify the action is edit or remove.
        if (this._url.searchParams.get('dispatch') === 'add') {
            throw new Error('The dispatch ID is only set when editing or removing dispatches..')
        }

        // Append dispatch ID to URL.
        this._url.searchParams.append('dispatchid', id.toString());

        // Method chaining
        return this;
    }

    /**
     * Sends command asynchronously according to specifications with mode=prepare and mode=execute.
     * Returns true if success or throws an error.
     */
    public async executeAsync(): Promise<boolean> {
        /*----- 1. Retrieve the x-pin -----*/
        if (this.xPin === undefined) {
            this.xPin = (await new PrivateRequestBuilder(this.API).authenticate(this.nation, this.password))._authentication._xPin;
        }

        /*----- 2. Prepare Request -----*/
        // Append prepare mode to the url to later retrieve the success token.
        this._url.searchParams.append('mode', 'prepare');

        // Send the request.
        // Check rate limit.
        await this.execRateLimit();

        // Send request
        try {
            // Send request.
            const res = await fetch(this._url.href, {
                headers: {
                    'User-Agent': this.API.userAgent,
                    'X-Pin': this.xPin.toString()
                }
            });

            // Log request and update rate limit.
            await this.logRequest(res);

        } catch (err) {
            throw new Error(`Error sending request: ${err}`);
        }

        // Convert request to JS and extract success token.
        let token: string = (await this.convertToJSAsync()).js['success'];

        /*----- 3. Execute Request Request -----*/
        // Replace prepare mode from the url with execute and append success token.
        this._url.searchParams.set('mode', 'execute');
        this._url.searchParams.append('token', token);

        // Rate limit
        await this.execRateLimit();

        // Send request
        try {
            // Send request.
            const res = await fetch(this._url.href, {
                headers: {
                    'User-Agent': this.API.userAgent,
                    'X-Pin': this.xPin.toString()
                }
            });

            // Log request and update rate limit.
            await this.logRequest(res);

        } catch (err) {
            throw new Error(`Error sending request: ${err}`);
        }

        return true;
    }
}





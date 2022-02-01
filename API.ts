// Node-fetch v.2.6.5. Still supported by developers.
import fetch from 'node-fetch';
// Filesystem
import * as fs from "fs";
// Xml2js v.0.4.23
import * as xml2js from 'xml2js';
// Zlib
import * as zlib from 'zlib';

export enum NationPublic {
    admirable = "admirable",
    admirables = "admirables",
    animal = "animal",
    animaltrait = "animaltrait",
    answered = "answered",
    banner = "banner",
    banners = "banners",
    capital = "capital",
    category = "category",
    census = "census",
    crime = "crime",
    currency = "currency",
    customleader = "customleader",
    customcapital = "customcapital",
    customreligion = "customreligion",
    dbid = "dbid",
    deaths = "deaths",
    demonym = "demonym",
    demonym2 = "denonym",
    demonym2plural = "demonym2plural",
    dispatches = "dispatches",
    dispatchlist = "dispatchlist",
    endorsements = "endorsements",
    factbooks = "factbooks",
    factbooklist = "factbooklist",
    firstlogin = "firstlogin",
    flag = "flag",
    founded = "founded",
    foundedtime = "foundedtime",
    freedom = "freedom",
    fullname = "fullname",
    gavote = "gavote",
    gdp = "gdp",
    govt = "govt",
    govtdesc = "govtdesc",
    govtpriority = "govtpriority",
    happenings = "happenings",
    income = "income",
    industrydesc = "industrydesc",
    influence = "influence",
    lastactivity = "lastactivity",
    lastlogin = "lastlogin",
    leader = "leader",
    legislation = "legislation",
    majorindustry = "majorindustry",
    motto = "motto",
    name = "name",
    notable = "notable",
    notables = "notables",
    policies = "policies",
    poorest = "poorest",
    population = "population",
    publicsector = "publicsector",
    rcensus = "rcensus",
    region = "region",
    religion = "religion",
    richest = "richest",
    scvote = "scvote",
    sectors = "sectors",
    sensibilites = "sensibilites",
    tax = "tax",
    tgcanrecruit = "tgcanrecruit",
    tgcancampaign = "tgcancampaign",
    type = "type",
    wa = "wa",
    wabadges = "wabadges",
    wcensus = "wcensus",
    zombie = "zombie"
}

export enum NationPrivate {
    dossier = "dossier",
    issues = "issues",
    issuesummary = "issuesummary",
    nextissue = "nextissue",
    nextissuetime = "nextissuetime",
    notices = "notices",
    packs = "packs",
    ping = "ping",
    rdossier = "rdossier",
    unread = "unread",
}

export enum Region {
    census = "census",
    censusranks = "censusranks",
    dbid = "dbid",
    delegate = "delegate",
    delegateauth = "delegateauth",
    delegatevotes = "delegatevotes",
    dispatches = "dispatches",
    embassies = "embassies",
    embassyrmb = "embassyrmb",
    factbook = "factbook",
    flag = "flag",
    founded = "founded",
    foundedtime = "foundedtime",
    founder = "founder",
    founderauth = "founderauth",
    gavote = "gavote",
    happenings = "happenings",
    history = "history",
    lastupdate = "lastupdate",
    messages = "messages",
    name = "name",
    nations = "nations",
    numnations = "numnations",
    officers = "officers",
    poll = "poll",
    power = "power",
    scvote = "scvote",
    tags = "tags",
    wabadges = "wabadges",
    zombie = "zombie"
}

export enum World {
    banner = "banner",
    census = "census",
    censusid = "censusid",
    censusdesc = "censusdesc",
    censusname = "censusname",
    censusranks = "censusranks",
    censusscale = "censusscale",
    censustitle = "censustitle",
    dispatch = "dispatch",
    dispatchlist = "dispatchlist",
    faction = "faction",
    factions = "factions",
    featuredregion = "featuredregion",
    happenings = "happenings",
    lastevenid = "lastevenid",
    nations = "nations",
    newnations = "newnations",
    numnations = "numnations",
    numregions = "numregions",
    poll = "poll",
    regions = "regions",
    regionsbytag = "regionsbytag",
    tgqueue = "tgqueue",
}

export enum WorldAssembly {
    numnations = "numnations",
    numdelegates = "numdelegates",
    delegates = "delegates",
    members = "members",
    happenings = "happenings",
    proposals = "proposals",
    resolution = "resolution",
    voters = "voters",
    votetrack = "votetrack",
    dellog = "dellog",
    delvotes = "delvotes",
    lastresolution = "lastresolution"
}

export enum Cards {
    info = "info",
    markets = "markets",
    owners = "owners",
    trades = "trades",
}

/**
 * Required for all other classes. Defines the configuration of the wrapper and is used to enforce rate limits and user agents.
 * @example const api = new API('Testlandia');
 */
export class API {
    static readonly version: string = '1.0.0';
    private _userAgent: string;
    private _rateLimit: number = 650;
    protected static _lastRequestMs: number;

    /**
     * Instance must be instantiated with a user agent string. Setting a custom rate limit is optional.
     * @param {string} userAgent
     * @param {number} rateLimit
     */
    constructor(userAgent: string, rateLimit?: number) {
        this.userAgent = userAgent; // Uses setter

        // If optional rate limit parameter was input.
        if (rateLimit) this.rateLimit = rateLimit;
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
            typeof (userAgent) !== 'string')
                // Throw error.
                throw new Error(`You submitted an invalid user agent: ${userAgent}`);

        // Set user agent.
        this._userAgent = `User-Agent: ${userAgent}. Using NationStates.js wrapper written by Heaveria.`;
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
        if (ms < 650 || typeof (ms) !== 'number') throw new Error(`You submitted an invalid rate limit: ${ms}ms. Must be equal to or higher than 650.`);

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
        if (typeof (ms) !== 'number' || ms <= 0) throw new Error('Parameter must be a number.')

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
 * Enumerator for the different WA API calls. See addCouncilID() for usage.
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
export interface IResponse {
    fetchResponse: any,
    unixTime: number,
    statusCode: number,
    statusBool: boolean,
    body: any,
    error?: string,
    js?: any
}

interface IResponseStatus {
    code: number,
    bool: boolean
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
    protected _urlObj: URL = new URL('https://www.nationstates.net/cgi-bin/api.cgi');
    protected _shards: string[] = [];
    protected _response: IResponse;

    constructor(API: API) {
        this.API = API;
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

/*----------PrivateRequestBuilder----------*/

/**
 * Defines the structure of the _authentication object in the API class.
 * @interface
 */
export interface IAuth {
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
    public _authentication: IAuth = {
        status: false,
    }

    constructor(api: API) {
        super(api);
    }

    /**
     * Returns the authentication information as an object.
     */
    get authInfo(): IAuth {
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

/*-------------NSMethods-------------*/

/**
 * Defines the options for downloading dumps and what to do with them.
 */
export interface IDumpOptions {
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
            .addNation(nation2.replace(/ /g, '_'))
            .addShards('endorsements')
            .sendRequestAsync())
            .convertToJSAsync();

        // Uses RegExp to verify if nation1 is in commma-seperated list of endorsements and returns the boolean.
        return new RegExp('(?:^|,)' + nation1.replace(/ /g, '_') + '(?:,|$)').test(r.js['endorsements'])
    }

    /**
     * Use the NS Verification API to verify the validity of a verification code.
     * Returns either a 0 or 1 as a number, as described in the NS API documentation.
     * @example console.log(await methods.verify('Testlandia', '12345')); // 0
     * @param nation
     * @param checksum
     * @param siteSpecificToken
     */
    public async verify(nation: string, checksum: string, siteSpecificToken?: string): Promise<number> {
        // Reset the object's URL.
        this.resetURL();

        // Add nation
        this.addNation(nation.toLowerCase().replace(/ /g, '_'));

        // Adds "a=verify" to the URL parameters.
        this._urlObj.searchParams.append('a', 'verify');
        // Adds checksum
        this._urlObj.searchParams.append('checksum', checksum);
        // Adds site specific token if it is set.
        if (siteSpecificToken) {
            this._urlObj.searchParams.append('token', siteSpecificToken);
        }

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
    public async downloadDumpAsync(type: string, directoryToSave: string, options?: IDumpOptions): Promise<NSMethods> {
        // TODO: Implement decoding utf-8 within the dump.
        // Verify if type is correct
        if (type !== 'nations' && type !== 'regions') throw new Error('Type must be either "nation" or "region"');

        // Get current date as YYYY-MM-DD
        const currentDate = new Date().toISOString().slice(0, 10);

        // Set fileName with directory
        const fileName = directoryToSave + type + '.' + currentDate;

        // If the dump is already present, do not download it.
        if (!fs.existsSync(fileName + '.xml.gz')) {
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
        }

        if (options?.extract) await this.gunzip(fileName + '.xml.gz', fileName + '.xml');

        if (options?.convertToJson) {
            // Verify the XML file has been unzipped. If not, do so.
            if (!fs.existsSync(fileName + '.xml')) await this.gunzip(fileName + '.xml.gz', fileName + '.xml');

            // Convert the XML file to JSON.
            await this.xmlToJson(fileName + '.xml', fileName + '.json');
        }

        if (options?.deleteXMLGz) fs.unlinkSync(fileName + '.xml.gz');

        if (options?.deleteXML) fs.unlinkSync(fileName + '.xml');

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
    private async xmlToJson(file: string, savePath: string) {
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
 * Dispatch modes
 */
export enum Mode {
    add = 'add',
    remove = 'remove',
    edit = 'edit'
}

/**
 * Dispatch categories
 */
export enum Category {
    factbook = 1,
    bulletin = 3,
    account = 5,
    meta = 8
}

/**
 * Dispatch factbook subcategories
 */
export enum Factbook {
    overview = 100,
    history = 101,
    geography = 102,
    culture = 103,
    politics = 104,
    legislation = 105,
    religion = 106,
    military = 107,
    economy = 108,
    international = 109,
    trivia = 110,
    miscellaneous = 111,
}

/**
 * Dispatch bulletin subcategories
 */
export enum Bulletin {
    policy = 305,
    news = 315,
    opinion = 325,
    campaign = 385,
}

/**
 * Dispatch account subcategories
 */
export enum Account {
    military = 505,
    trade = 515,
    sport = 525,
    drama = 535,
    diplomacy = 545,
    science = 555,
    culture = 565,
    other = 595
}

/**
 * Dispatch meta subcategories
 */
export enum Meta {
    subcategory = 835,
    reference = 845
}

/**
 * A class to handle creating, editing, and deleting dispatches in more high-level functions.
 * @example const methods = new Dispatch(api, 'nation', 'password', Mode.add);
 * @param { API } API The API object to enforce rate limiting and user agents.
 * @param { string } nation Your nation name without prefixes. Used for authenticating with the NationStates API.
 * @param { string } password Your password. Used for authenticating with the NationStates API.
 * @param { Mode } action Enumerator to specify the action to be taken.
 */
export class Dispatch extends RequestBuilder {
    API: API;
    private readonly nation: string;
    private readonly password: string;
    private readonly action: Mode;

    constructor(api: API, nation: string, password: string, action: Mode) {
        super(api);
        this.API = api;
        this.nation = nation;
        this.password = password;
        this.action = action;
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
        if (typeof method !== 'string') throw new Error('Action must be a string.');

        // Standardize
        method = method.toLowerCase().trim();

        // Only allow add, remove, and edit.
        let result: boolean = false;
        if (method === 'add') result = true
        if (method === 'remove') result = true;
        if (method === 'edit') result = true;

        if (result) {
            this._urlObj.searchParams.append('dispatch', method);
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
        if (typeof text !== 'string') throw new Error('The title must be a string.');

        // Append to URL.
        this._urlObj.searchParams.append('title', text)

        // Method Chaining
        return this;
    }

    /**
     * Add text to the dispatch.
     * @param text
     */
    public text(text: string) {
        // Type-checking
        if (typeof text !== 'string') throw new Error('The text must be a string.');

        // Append to URL.
        this._urlObj.searchParams.append('text', text)

        // Method Chaining
        return this;
    }

    /**
     * Set the category of the dispatch.
     * @param category
     */
    public category(category: Category) {
        // Type-checking
        if (typeof (category) !== 'number') throw new Error('The category must be a number. See NationStates API documentation.')

        // Set the category
        this._urlObj.searchParams.append('category', category.toString());

        // Method chaining
        return this;
    }

    /**
     * Set the category of the dispatch.
     * @param subcategory
     */
    public subcategory(subcategory: Factbook | Bulletin | Account | Meta) {
        // Type-checking
        if (typeof (subcategory) !== 'number') throw new Error('The category must be a number. See NationStates API documentation.')

        // Set the category
        this._urlObj.searchParams.append('subcategory', subcategory.toString());

        // Method chaining
        return this;
    }

    /**
     * Set the dispatch ID when editing or a removing a dispatch.
     * @param id
     */
    public dispatchID(id: number) {
        // Type-checking
        if (typeof (id) !== 'number') throw new Error('The dispatch ID must be a number.')

        // Verify the action is edit or remove.
        if (this._urlObj.searchParams.get('dispatch') === 'add') throw new Error('The dispatch ID is only set when editing or removing dispatches..')

        // Append dispatch ID to URL.
        this._urlObj.searchParams.append('dispatchid', id.toString());

        // Method chaining
        return this;
    }

    /**
     * Obtain the x-pin of a nation.
     * @private
     */
    private async authenticate() {
        const privateRequest = new PrivateRequestBuilder(this.API);
        await privateRequest.authenticate(this.nation, this.password);
        return privateRequest._authentication._xPin;
    }

    /**
     * Sends command asynchronously according to specifications with mode=prepare and mode=execute.
     * Returns true if success or throws an error.
     */
    public async executeAsync(): Promise<boolean> {
        /*----- 1. Retrieve the x-pin -----*/
        const xPin = await this.authenticate();

        /*----- 2. Prepare Request -----*/
        // Append prepare mode to the url to later retrieve the success token.
        this.addNation(this.nation).addCustomParam('c', 'dispatch');
        this.addAction(this.action);
        this._urlObj.searchParams.append('mode', 'prepare');

        // Send the request.
        // Check rate limit.
        await this.execRateLimit();

        // Send request
        try {
            // Send request.
            const res = await fetch(this.href, {
                headers: {
                    'User-Agent': this.API.userAgent,
                    'X-Pin': xPin
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
        this._urlObj.searchParams.set('mode', 'execute');
        this._urlObj.searchParams.append('token', token);

        // Rate limit
        await this.execRateLimit();

        // Send request
        try {
            // Send request.
            const res = await fetch(this.href, {
                headers: {
                    'User-Agent': this.API.userAgent,
                    'X-Pin': xPin
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





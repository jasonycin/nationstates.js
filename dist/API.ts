export class API {
    static readonly version: string = '0.0.1-alpha';
    private readonly status: boolean = false;
    public _userAgent: string;
    private _rateLimit: number = 650;
    private _lastRequestMs: number;

    /**
     * Instance must be instantiated with a user agent string. Setting a custom rate limit is optional.
     * @param {string} userAgent
     * @param {number} rateLimit
     */
    constructor(userAgent: string, rateLimit?: number) {
        this.status = true;
        this.userAgent = userAgent; // Uses setter

        // Uses setter if optional parameter was input.
        if (rateLimit) {
            this.rateLimit = rateLimit;
        }
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
            throw new Error(`You submitted an invalid user agent: ${userAgent}`);
        }
        this._userAgent = userAgent;
    }

    /**
     * Returns the current rate limit as a string.
     */
    get rateLimit(): any {
        return `Current rate limit: ${this._rateLimit.toString()}ms`;
    }

    get rawRateLimit(): number {
        return this._rateLimit;
    }

    /**
     * Set the rateLimit of the instance. Verifies that the input is a number and is >= 650.
     * @param {number} ms - The number of milliseconds to set the rateLimit to.
     */
    set rateLimit(ms: number) {
        // Check minimum rate limit and data type.
        if (ms < 650 || typeof (ms) !== 'number') {
            throw new Error(`You submitted an invalid rate limit: ${ms}ms. Must be equal to or higher than 650.`);
        }
        this._rateLimit = ms;
    }

    get lastRequest(): number {
        return this._lastRequestMs;
    }

    set lastRequest(ms: number) {
        if (typeof (ms) !== 'number' || ms <= 0) {
            throw new Error('Parameter must be a number.')
        }
        this._lastRequestMs = ms;
    }

    /**
     * Returns the number of milliseconds since the last request.
     * @private
     */
    calcMsSinceLastRequest(): number {
        if (!this._lastRequestMs) {
            throw new Error('A former request does not exist or has not been set.')
        }
        return Date.now() - this._lastRequestMs;
    }
}

/*----------------------------*/

// Node-fetch v.2.6.5. Supported by developers.
import fetch from 'node-fetch';
// Filesystem
import * as fs from "fs";

export interface Response {
    unixTime: number,
    statusCode: number,
    statusBool: boolean,
    body: any,
    error?: string,
    json?: any
}

export class NSRequest {
    private API: API;
    public _url: URL = new URL('https://www.nationstates.net/cgi-bin/api.cgi');
    private _shards: string[] = [];
    _response: Response;

    constructor(API: API) {
        this.API = API;
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
        if (id !== 1 || 2) {
            throw new Error('Invalid ID. 1 = GA, 2 = SC.')
        }
        this._url.searchParams.append('wa', id.toString());
        // Method chaining.
        return this;
    }

    public addShards(shards: string | string[]): NSRequest {
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

    public deleteAllShards(): void {
        this._url.searchParams.delete('q');
        this._shards.length = 0;
    }

    public async execRateLimit(): Promise<void> {
        // Get difference in milliseconds between the current date and the last request sent.
        const difference: number = Date.now() - this.API.lastRequest;

        // If the difference exceeds the rate limit, wait for the difference.
        if (this.API.rawRateLimit > difference) {
            // Calculate the time to wait.
            const timeToWait: number = this.API.rawRateLimit - difference;
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
        const res = await fetch('https://www.nationstates.net/pages/nations.xml.gz');
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
                'User-Agent': `API written by Heaveria. In-use by: ${this.API._userAgent}`
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

    public async sendRequestAsync() {
        // Check rate limit.
        await this.execRateLimit();

        try {
            const res = await fetch(this._url.href, {
                headers: {
                    'User-Agent': `API written by Heaveria. In-use by: ${this.API._userAgent}`
                }
            });
            // Record the unix timestamp of the request for rate limiting.
            this.API.lastRequest = Date.now();
            // Handle Response
            this._response = {
                unixTime: Date.now(),
                statusCode: res.status,
                statusBool: res.ok,
                body: await res.text()
            }
        } catch (err) {
            throw new Error(err);
        }
        // Method chaining
        return this;
    }

    public getRawResponse(): string | NSRequest {
        if (this._response) {
            return this._response.body;
        }
        // Method chaining
        return this;
    }
}

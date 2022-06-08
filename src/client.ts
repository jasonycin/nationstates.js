/**
 * ⚠️ Deprecated! Use Client instead.
 * Required for all other classes. Defines the configuration of the wrapper and is used to enforce rate limits and user agents.
 * @example const api = new client('Testlandia');
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
        console.log(`%c${API.version} WARNING: API class is deprecated. Please switch to Client.`, 'color: #00ff00; font-weight: bold;');
        this.userAgent = userAgent;
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
        this._userAgent = userAgent;
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

export class Client {
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
        if (userAgent.length < 3 ||
            !userAgent.match(/^([0-9]|[a-z])+([0-9a-z]+)$/i) || // Must be alphanumeric, or only alpha, or only numeric
            userAgent.slice(-1) === ' ' ||  // Last character cannot be a space
            typeof (userAgent) !== 'string')
            throw new Error(`You submitted an invalid user agent: ${userAgent}`);
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
        if (ms < 650 || typeof (ms) !== 'number') throw new Error(`You submitted an invalid rate limit: ${ms}ms. Must be equal to or higher than 650.`);
        this._rateLimit = ms;
    }

    /**
     * Returns the last request time in milliseconds. Used to enforce rate limits.
     * @example console.log(api.lastRequestMs);
     */
    public get lastRequestMs(): number {
        return Client._lastRequestMs;
    }

    /**
     * ❌⚠️ DO NOT USE unless you kow what you're doing.
     * Set the time of the last request in milliseconds.
     * @example api.lastRequestMs = Date.now();
     * @param ms
     */
    set lastRequestMs(ms: number) {
        if (typeof (ms) !== 'number' || ms <= 0) throw new Error('Parameter must be a number greater than 0.')
        Client._lastRequestMs = ms;
    }
}

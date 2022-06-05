import {API, Client} from "../client";
import {RequestBuilder} from "../request_builder/request_builder";
import {Mode} from "../enums/mode";
import {Category} from "../enums/category";
import {Factbook} from "../enums/factbook";
import {Account} from "../enums/account";
import {Meta} from "../enums/meta";
import {PrivateRequestBuilder} from "../private_request_builder/private_request_builder";
import {Bulletin} from "../enums/bulletin";

/**
 * A class to handle creating, editing, and deleting dispatches in more high-level functions.
 * @example const methods = new Dispatch(api, 'nation', 'password', Mode.add);
 * @param { API } API The API object to enforce rate limiting and user agents.
 * @param { string } nation Your nation name without prefixes. Used for authenticating with the NationStates API.
 * @param { string } password Your password. Used for authenticating with the NationStates API.
 * @param { Mode } action Enumerator to specify the action to be taken.
 */
export class Dispatch extends RequestBuilder {
    API: Client;
    private readonly nation: string;
    private readonly password: string;
    private readonly action: Mode;

    constructor(api: API | Client, nation: string, password: string, action: Mode) {
        super(api);
        this.API = api instanceof API ? new Client(api.userAgent, api.rateLimit) : api;
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

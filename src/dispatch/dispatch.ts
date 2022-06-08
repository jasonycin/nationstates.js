import {API, Client} from "../client";
import {RequestBuilder} from "../request_builder/request_builder";
import {Mode} from "../enums/mode";
import {Category} from "../enums/category";
import {Factbook} from "../enums/factbook";
import {Account} from "../enums/account";
import {Meta} from "../enums/meta";
import {PrivateRequestBuilder} from "../private_request_builder/private_request_builder";
import {Bulletin} from "../enums/bulletin";
const fetch = require('node-fetch');

/**
 * A class to handle creating, editing, and deleting dispatches in more high-level functions.
 * @example const methods = new Dispatch(api, 'nation', 'password', Mode.add);
 * @param { client } client The client object to enforce rate limiting and user agents.
 * @param { string } nation Your nation name without prefixes. Used for authenticating with the NationStates client.
 * @param { string } password Your password. Used for authenticating with the NationStates client.
 * @param { Mode } action Enumerator to specify the action to be taken.
 */
export class Dispatch extends RequestBuilder {
    client: Client;
    private readonly nation: string;
    private readonly password: string;
    private readonly action: Mode;
    private result: {
        statusCode: number,
        statusBody: string,
        body: string
    }

    constructor(client: API | Client, nation: string, password: string, action: Mode) {
        super(client);
        this.client = client instanceof API ? new Client(client.userAgent, client.rateLimit) : client;
        this.nation = nation;
        this.password = password;
        this.action = action;
    }

    /**
     * Set the dispatch mode. It can be either:
     * - 'add'
     * - 'remove'
     * - 'edit'<br><br>
     * See NationStates client documentation for more information.
     * @param method
     */
    private addAction(method: string): void | Error {
        if (typeof method !== 'string') throw new Error('Action must be a string.');
        method = method.toLowerCase().trim();
        if (method !== 'add' && method !== 'remove' && method !== 'edit') {
            throw new Error('Action must be either "add", "remove", or "edit".');
        }
        this._urlObj.searchParams.append('dispatch', method);
    }

    /**
     * Add title to the dispatch.
     * @param text
     */
    public title(text: string) {
        if (typeof text !== 'string') throw new Error('The title must be a string.');
        this._urlObj.searchParams.append('title', text)
        return this;
    }

    /**
     * Add text to the dispatch.
     * @param text
     */
    public text(text: string) {
        if (typeof text !== 'string') throw new Error('The text must be a string.');
        this._urlObj.searchParams.append('text', text)
        return this;
    }

    /**
     * Set the category of the dispatch.
     * @param category
     */
    public category(category: Category) {
        if (typeof (category) !== 'number') {
            throw new Error('The category must be a number. See NationStates client documentation.')
        }
        this._urlObj.searchParams.append('category', category.toString());
        return this;
    }

    /**
     * Set the category of the dispatch.
     * @param subcategory
     */
    public subcategory(subcategory: Factbook | Bulletin | Account | Meta) {
        if (typeof (subcategory) !== 'number') throw new Error('The category must be a number. See NationStates client documentation.')
        this._urlObj.searchParams.append('subcategory', subcategory.toString());
        return this;
    }

    /**
     * Set the dispatch ID when editing or a removing a dispatch.
     * @param id
     */
    public dispatchID(id: number) {
        if (typeof (id) !== 'number') throw new Error('The dispatch ID must be a number.')
        if (this._urlObj.searchParams.get('dispatch') === 'add') {
            throw new Error('The dispatch ID is only set when editing or removing dispatches..')
        }
        this._urlObj.searchParams.append('dispatchid', id.toString());
        return this;
    }

    /**
     * Obtain the x-pin of a nation.
     * @private
     */
    private async authenticate() {
        const privateRequest = new PrivateRequestBuilder(this.client);
        await privateRequest.authenticate(this.nation, this.password);
        return privateRequest._authentication._xPin;
    }

    /**
     * Sends command asynchronously according to specifications with mode=prepare and mode=execute.
     * To check for success, access the returned response attribute.
     */
    public async execute(): Promise<RequestBuilder> {
        /*----- 1. Retrieve the x-pin -----*/
        const xPin = await this.authenticate();

        /*----- 2. Prepare Request & Get Token -----*/
        this.addNation(this.nation).addCustomParam('c', 'dispatch');
        this.addAction(this.action);
        this._urlObj.searchParams.append('mode', 'prepare');

        await this.execRateLimit();

        try {
            const res = await fetch(this.href, {
                headers: {
                    'User-Agent': this.client.userAgent,
                    'X-Pin': xPin
                }
            });
            await this.logRequest(res);
        } catch (err) {
            throw new Error(`Error sending request: ${err}`);
        }

        let token: string = (await this.toJS()).js['success']; // Convert request to JS and extract success token.

        /*----- 3. Execute Request -----*/
        this._urlObj.searchParams.set('mode', 'execute');
        this._urlObj.searchParams.append('token', token);
        await this.execRateLimit();
        try {
            const res = await fetch(this.href, {
                headers: {
                    'User-Agent': this.client.userAgent,
                    'X-Pin': xPin
                }
            });
            await this.logRequest(res);
        } catch (err) {
            throw new Error(`Error sending request: ${err}`);
        }
        return this;
    }
}

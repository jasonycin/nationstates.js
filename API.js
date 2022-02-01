"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dispatch = exports.Meta = exports.Account = exports.Bulletin = exports.Factbook = exports.Category = exports.Mode = exports.NSMethods = exports.PrivateRequestBuilder = exports.RequestBuilder = exports.CouncilID = exports.xmlParser = exports.API = exports.Cards = exports.WorldAssembly = exports.World = exports.Region = exports.NationPrivate = exports.NationPublic = void 0;
// Node-fetch v.2.6.5. Still supported by developers.
var node_fetch_1 = require("node-fetch");
// Filesystem
var fs = require("fs");
// Xml2js v.0.4.23
var xml2js = require("xml2js");
// Zlib
var zlib = require("zlib");
var NationPublic;
(function (NationPublic) {
    NationPublic["admirable"] = "admirable";
    NationPublic["admirables"] = "admirables";
    NationPublic["animal"] = "animal";
    NationPublic["animaltrait"] = "animaltrait";
    NationPublic["answered"] = "answered";
    NationPublic["banner"] = "banner";
    NationPublic["banners"] = "banners";
    NationPublic["capital"] = "capital";
    NationPublic["category"] = "category";
    NationPublic["census"] = "census";
    NationPublic["crime"] = "crime";
    NationPublic["currency"] = "currency";
    NationPublic["customleader"] = "customleader";
    NationPublic["customcapital"] = "customcapital";
    NationPublic["customreligion"] = "customreligion";
    NationPublic["dbid"] = "dbid";
    NationPublic["deaths"] = "deaths";
    NationPublic["demonym"] = "demonym";
    NationPublic["demonym2"] = "denonym";
    NationPublic["demonym2plural"] = "demonym2plural";
    NationPublic["dispatches"] = "dispatches";
    NationPublic["dispatchlist"] = "dispatchlist";
    NationPublic["endorsements"] = "endorsements";
    NationPublic["factbooks"] = "factbooks";
    NationPublic["factbooklist"] = "factbooklist";
    NationPublic["firstlogin"] = "firstlogin";
    NationPublic["flag"] = "flag";
    NationPublic["founded"] = "founded";
    NationPublic["foundedtime"] = "foundedtime";
    NationPublic["freedom"] = "freedom";
    NationPublic["fullname"] = "fullname";
    NationPublic["gavote"] = "gavote";
    NationPublic["gdp"] = "gdp";
    NationPublic["govt"] = "govt";
    NationPublic["govtdesc"] = "govtdesc";
    NationPublic["govtpriority"] = "govtpriority";
    NationPublic["happenings"] = "happenings";
    NationPublic["income"] = "income";
    NationPublic["industrydesc"] = "industrydesc";
    NationPublic["influence"] = "influence";
    NationPublic["lastactivity"] = "lastactivity";
    NationPublic["lastlogin"] = "lastlogin";
    NationPublic["leader"] = "leader";
    NationPublic["legislation"] = "legislation";
    NationPublic["majorindustry"] = "majorindustry";
    NationPublic["motto"] = "motto";
    NationPublic["name"] = "name";
    NationPublic["notable"] = "notable";
    NationPublic["notables"] = "notables";
    NationPublic["policies"] = "policies";
    NationPublic["poorest"] = "poorest";
    NationPublic["population"] = "population";
    NationPublic["publicsector"] = "publicsector";
    NationPublic["rcensus"] = "rcensus";
    NationPublic["region"] = "region";
    NationPublic["religion"] = "religion";
    NationPublic["richest"] = "richest";
    NationPublic["scvote"] = "scvote";
    NationPublic["sectors"] = "sectors";
    NationPublic["sensibilites"] = "sensibilites";
    NationPublic["tax"] = "tax";
    NationPublic["tgcanrecruit"] = "tgcanrecruit";
    NationPublic["tgcancampaign"] = "tgcancampaign";
    NationPublic["type"] = "type";
    NationPublic["wa"] = "wa";
    NationPublic["wabadges"] = "wabadges";
    NationPublic["wcensus"] = "wcensus";
    NationPublic["zombie"] = "zombie";
})(NationPublic = exports.NationPublic || (exports.NationPublic = {}));
var NationPrivate;
(function (NationPrivate) {
    NationPrivate["dossier"] = "dossier";
    NationPrivate["issues"] = "issues";
    NationPrivate["issuesummary"] = "issuesummary";
    NationPrivate["nextissue"] = "nextissue";
    NationPrivate["nextissuetime"] = "nextissuetime";
    NationPrivate["notices"] = "notices";
    NationPrivate["packs"] = "packs";
    NationPrivate["ping"] = "ping";
    NationPrivate["rdossier"] = "rdossier";
    NationPrivate["unread"] = "unread";
})(NationPrivate = exports.NationPrivate || (exports.NationPrivate = {}));
var Region;
(function (Region) {
    Region["census"] = "census";
    Region["censusranks"] = "censusranks";
    Region["dbid"] = "dbid";
    Region["delegate"] = "delegate";
    Region["delegateauth"] = "delegateauth";
    Region["delegatevotes"] = "delegatevotes";
    Region["dispatches"] = "dispatches";
    Region["embassies"] = "embassies";
    Region["embassyrmb"] = "embassyrmb";
    Region["factbook"] = "factbook";
    Region["flag"] = "flag";
    Region["founded"] = "founded";
    Region["foundedtime"] = "foundedtime";
    Region["founder"] = "founder";
    Region["founderauth"] = "founderauth";
    Region["gavote"] = "gavote";
    Region["happenings"] = "happenings";
    Region["history"] = "history";
    Region["lastupdate"] = "lastupdate";
    Region["messages"] = "messages";
    Region["name"] = "name";
    Region["nations"] = "nations";
    Region["numnations"] = "numnations";
    Region["officers"] = "officers";
    Region["poll"] = "poll";
    Region["power"] = "power";
    Region["scvote"] = "scvote";
    Region["tags"] = "tags";
    Region["wabadges"] = "wabadges";
    Region["zombie"] = "zombie";
})(Region = exports.Region || (exports.Region = {}));
var World;
(function (World) {
    World["banner"] = "banner";
    World["census"] = "census";
    World["censusid"] = "censusid";
    World["censusdesc"] = "censusdesc";
    World["censusname"] = "censusname";
    World["censusranks"] = "censusranks";
    World["censusscale"] = "censusscale";
    World["censustitle"] = "censustitle";
    World["dispatch"] = "dispatch";
    World["dispatchlist"] = "dispatchlist";
    World["faction"] = "faction";
    World["factions"] = "factions";
    World["featuredregion"] = "featuredregion";
    World["happenings"] = "happenings";
    World["lastevenid"] = "lastevenid";
    World["nations"] = "nations";
    World["newnations"] = "newnations";
    World["numnations"] = "numnations";
    World["numregions"] = "numregions";
    World["poll"] = "poll";
    World["regions"] = "regions";
    World["regionsbytag"] = "regionsbytag";
    World["tgqueue"] = "tgqueue";
})(World = exports.World || (exports.World = {}));
var WorldAssembly;
(function (WorldAssembly) {
    WorldAssembly["numnations"] = "numnations";
    WorldAssembly["numdelegates"] = "numdelegates";
    WorldAssembly["delegates"] = "delegates";
    WorldAssembly["members"] = "members";
    WorldAssembly["happenings"] = "happenings";
    WorldAssembly["proposals"] = "proposals";
    WorldAssembly["resolution"] = "resolution";
    WorldAssembly["voters"] = "voters";
    WorldAssembly["votetrack"] = "votetrack";
    WorldAssembly["dellog"] = "dellog";
    WorldAssembly["delvotes"] = "delvotes";
    WorldAssembly["lastresolution"] = "lastresolution";
})(WorldAssembly = exports.WorldAssembly || (exports.WorldAssembly = {}));
var Cards;
(function (Cards) {
    Cards["info"] = "info";
    Cards["markets"] = "markets";
    Cards["owners"] = "owners";
    Cards["trades"] = "trades";
})(Cards = exports.Cards || (exports.Cards = {}));
/**
 * Required for all other classes. Defines the configuration of the wrapper and is used to enforce rate limits and user agents.
 * @example const api = new API('Testlandia');
 */
var API = /** @class */ (function () {
    /**
     * Instance must be instantiated with a user agent string. Setting a custom rate limit is optional.
     * @param {string} userAgent
     * @param {number} rateLimit
     */
    function API(userAgent, rateLimit) {
        this._rateLimit = 650;
        this.userAgent = userAgent; // Uses setter
        // If optional rate limit parameter was input.
        if (rateLimit)
            this.rateLimit = rateLimit;
    }
    Object.defineProperty(API.prototype, "userAgent", {
        /**
         * Retrieves the user agent string.
         * @example console.log(api.userAgent);
         */
        get: function () {
            return this._userAgent;
        },
        /**
         * Sets the user agent. Verifies the parameter length if less than three, is alphanumeric,
         * does not end in an empty space, and is a string.
         * @example api.userAgent = 'Testlandia';
         * @param {string} userAgent
         */
        set: function (userAgent) {
            userAgent = userAgent.trim();
            if ( // Minimum length
            userAgent.length < 3 ||
                // Must be alphanumeric, or only alpha, or only numeric
                !userAgent.match(/^([0-9]|[a-z])+([0-9a-z]+)$/i) ||
                // Last character cannot be a space
                userAgent.slice(-1) === ' ' ||
                // Data type is string.
                typeof (userAgent) !== 'string')
                // Throw error.
                throw new Error("You submitted an invalid user agent: " + userAgent);
            // Set user agent.
            this._userAgent = "User-Agent: " + userAgent + ". Using NationStates.js wrapper written by Heaveria.";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(API.prototype, "rateLimit", {
        /**
         * Returns the current rate limit as a number.
         * @example console.log(api.rateLimit);
         */
        get: function () {
            return this._rateLimit;
        },
        /**
         * Set the rateLimit of the instance. Verifies that the input is a number and is >= 650.
         * @example api.rateLimit = 1500;
         * @param {number} ms - The number of milliseconds to set the rateLimit to.
         */
        set: function (ms) {
            // Check minimum rate limit and data type.
            if (ms < 650 || typeof (ms) !== 'number')
                throw new Error("You submitted an invalid rate limit: " + ms + "ms. Must be equal to or higher than 650.");
            // Set rate limit.
            this._rateLimit = ms;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(API.prototype, "lastRequestMs", {
        /**
         * Returns the last request time in milliseconds. Used to enforce rate limits.
         * @example console.log(api.lastRequestMs);
         */
        get: function () {
            return API._lastRequestMs;
        },
        /**
         * ❌⚠️ DO NOT USE unless you kow what you're doing.
         * Set the time of the last request in milliseconds.
         * @example api.lastRequestMs = Date.now();
         * @param ms
         */
        set: function (ms) {
            // Data type checking and value checking
            if (typeof (ms) !== 'number' || ms <= 0)
                throw new Error('Parameter must be a number.');
            // Set the last request time.
            API._lastRequestMs = ms;
        },
        enumerable: false,
        configurable: true
    });
    API.version = '1.0.0';
    return API;
}());
exports.API = API;
/*---------------------------------------------*/
/**
 * @author The xmLParser is based on the following written by Auralia:
 * https://github.com/auralia/node-nsapi/blob/master/src/api.ts#L25
 * @hidden
 */
exports.xmlParser = new xml2js.Parser({
    charkey: "value",
    trim: true,
    normalizeTags: true,
    normalize: true,
    explicitRoot: false,
    explicitArray: false,
    mergeAttrs: true,
    attrValueProcessors: [function (value) {
            var num = Number(value);
            if (!isNaN(num)) {
                return num;
            }
            else {
                return value;
            }
        }],
    valueProcessors: [function (value) {
            var num = Number(value);
            if (!isNaN(num)) {
                return num;
            }
            else {
                return value;
            }
        }]
});
/**
 * Enumerator for the different WA API calls. See addCouncilID() for usage.
 */
var CouncilID;
(function (CouncilID) {
    CouncilID[CouncilID["GeneralAssembly"] = 1] = "GeneralAssembly";
    CouncilID[CouncilID["SecurityCouncil"] = 2] = "SecurityCouncil";
})(CouncilID = exports.CouncilID || (exports.CouncilID = {}));
/**
 * Build a request to your specifications! Usage:
 * - (1) Define the architecture of a https request before it sent to the API.
 * - (2) Access and modify the response of a request.
 * @example const request = await new RequestBuilder(api).addNation('testlandia').sendRequestAsync();
 * console.log(request.body);
 * @param {API} api - The API instance to use. Used to enforce the rate limit and user agent.
 */
var RequestBuilder = /** @class */ (function () {
    function RequestBuilder(API) {
        this._urlObj = new URL('https://www.nationstates.net/cgi-bin/api.cgi');
        this._shards = [];
        this.API = API;
    }
    Object.defineProperty(RequestBuilder.prototype, "responseData", {
        /**
         * Returns full node-fetch request and other meta-data created by the API wrapper.
         * Typical usage would to analyze the request for any errors.
         * @example console.log(request.fetchResponse);
         */
        get: function () {
            // Verify if response is undefined.
            if (!this._response)
                throw new Error('No response found. Send a request first using sendRequestAsync()!');
            return this._response;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RequestBuilder.prototype, "responseStatus", {
        /**
         * Returns the response status code and status boolean from the node-fetch response as an object.
         * @example console.log(request.responseStatus.statusCode);
         */
        get: function () {
            // Verify if response is undefined.
            if (!this._response)
                throw new Error('No response found. Send a request first using sendRequestAsync()!');
            return {
                code: this._response.statusCode,
                bool: this._response.statusBool
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RequestBuilder.prototype, "body", {
        /**
         * Returns the current body of the last node-fetch request associated with this instance.
         * @example console.log(request.body);
         */
        get: function () {
            // Verifies if a response has been received.
            if (!this._response)
                throw new Error('No body found. Have you sent and awaited your request via sendRequestAsync()?');
            // If the body is a number, convert the string to a number and return it, else return the body as is.
            return !isNaN(this._response.body) ? parseInt(this._response.body) : this._response.body;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RequestBuilder.prototype, "js", {
        /**
         * Returns the current JS object of the last node-fetch request associated with this instance.
         * You must convert the body to a JS object before using this method via convertBodyToJSON().
         * @example request.convertToJSON();
         * console.log(request.js);
         */
        get: function () {
            // Verify if the response has been converted to js.
            if (!this._response.js)
                throw new Error('No JSON found. Try convertToJSAsync() first and make sure a request has been sent.');
            return this._response.js;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RequestBuilder.prototype, "shards", {
        /**
         * Returns the current shards of a RequestBuilder object as a single string or as an array of strings.
         * @example console.log(request.shards);
         */
        get: function () {
            // Verifies if shards have been added.
            if (!this._shards)
                throw new Error('No shards have been added.');
            // If there is only a single shard, return it.
            if (this._shards.length === 1)
                return this._shards[0];
            // Returns the array of shards.
            return this._shards;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RequestBuilder.prototype, "href", {
        /**
         * Builds and then returns the URL for which the request will be sent.
         * Serves the purpose of ensuring proper URL encoding.
         */
        get: function () {
            // Base url: https://www.nationstates.net/cgi-bin/api.cgi
            var url = this._urlObj.origin + this._urlObj.pathname + '?';
            // Unless a query string, encode the shards.
            var params = [];
            this._urlObj.searchParams.forEach(function (value, key) {
                if (key === 'q') {
                    params.push(key + "=" + decodeURIComponent(value));
                }
                else {
                    params.push(key + "=" + encodeURIComponent(value));
                }
            });
            // Return the url with the shards, which had been formatted above.
            return url + params.join('&');
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Adds the nation to the url parameters.
     * @example .addNation('Testlandia') adds 'nation=Testlandia' to the url.
     * @param name - The name of the nation from which data is retrieved.
     */
    RequestBuilder.prototype.addNation = function (name) {
        if ( // Minimum length
        name.length < 3 ||
            // Must be alphanumeric, or only alpha, or only numeric
            !name.match(/^[\w\-\s]+$/) ||
            // Last character cannot be a space
            name.slice(-1) === ' ' ||
            // Data type is string.
            typeof (name) !== 'string')
            throw new Error("You submitted an invalid nation name: " + name);
        // Append nation to the url.
        this._urlObj.searchParams.append('nation', name);
        // Method chaining.
        return this;
    };
    /**
     * Adds the region to the url parameters.
     * @example .addRegion('The South Pacific') adds 'region=The%20South%20Pacific' to the url.
     * @param name
     */
    RequestBuilder.prototype.addRegion = function (name) {
        // Append region to the url.
        this._urlObj.searchParams.append('region', name);
        // Method chaining.
        return this;
    };
    /**
     * Adds a council ID to the url parameters.
     * @example .addCouncil(1) adds 'wa=1' to the url.
     * @param id
     */
    RequestBuilder.prototype.addCouncilID = function (id) {
        // Type-checking
        if (typeof (id) !== 'number')
            throw new Error("You submitted an invalid council ID: " + id + ". Must be a number.");
        // Verify if ID matches NationStates API specifications.
        if (id > 2 || id < 0)
            throw new Error('Invalid ID. 1 = GA, 2 = SC.');
        // Append to URL.
        this._urlObj.searchParams.append('wa', id.toString());
        // Method chaining.
        return this;
    };
    /**
     * Adds a resolution ID to the url parameters.
     * @example .addResolutionID(22) adds 'id=22' to the url parameters.
     * @param id
     */
    RequestBuilder.prototype.addResolutionID = function (id) {
        // Type-checking
        if (typeof (id) !== 'number')
            throw new Error("You submitted an invalid resolution ID: " + id + ". Must be a number.");
        // Append to URL.
        this._urlObj.searchParams.append('id', id.toString());
        // Method chaining.
        return this;
    };
    /**
     * Add shards to the url parameters after the 'q=' parameter.
     * @example .addShards('flag') adds 'q=Testlandia' to the url.
     * @example .addShards([ 'flag', 'population' ]) adds 'q=flag+population' to the url.
     * @param shards
     */
    RequestBuilder.prototype.addShards = function (shards) {
        switch (typeof (shards)) {
            // If only a single shard is given, push it to _shards[].
            case "string":
                this._shards.push(shards);
                break;
            // If array of strings, then push each string to _shards[].
            case "object":
                // Iterate over each shard.
                for (var _i = 0, shards_1 = shards; _i < shards_1.length; _i++) {
                    var shard = shards_1[_i];
                    this._shards.push(shard);
                }
                break;
            // Error handling
            default:
                throw new Error("Invalid type of _shards. Must be a string or an array of strings.");
        }
        // Check if shards are already in the url. If yes, deletes them.
        if (this._urlObj.searchParams.has('q'))
            this._urlObj.searchParams.delete('q');
        // Add shards[] to URL.
        this._urlObj.searchParams.append('q', this._shards.join('+'));
        // Method chaining
        return this;
    };
    /**
     * Appends the given parameters to the url with the defined key and value.
     * @example .addCustomParam('key', 'value') adds 'key=value' to the url.
     * @param key
     * @param value
     */
    RequestBuilder.prototype.addCustomParam = function (key, value) {
        // Append key and value to the url.
        this._urlObj.searchParams.append(key.toString(), value.toString());
        // Method chaining.
        return this;
    };
    /**
     * Removes all shards from the RequestBuilder object and its associated URL.
     * @example new RequestBuilder(api).addShards('numnations').removeShards()
     */
    RequestBuilder.prototype.deleteAllShards = function () {
        this._urlObj.searchParams.delete('q');
        this._shards.length = 0;
    };
    /**
     * Enforces the rate-limit by calculating time-to-wait and then waiting for the specified amount of time.
     */
    RequestBuilder.prototype.execRateLimit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var difference, timeToWait_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        difference = Date.now() - this.API.lastRequestMs;
                        if (!(this.API.rateLimit > difference)) return [3 /*break*/, 2];
                        timeToWait_1 = this.API.rateLimit - difference;
                        // Forcefully stop JavaScript execution.
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, timeToWait_1); })];
                    case 1:
                        // Forcefully stop JavaScript execution.
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Executes the request and saves the response to the RequestBuilder object.
     * Retrieve after awaiting it via .response, .body, or convert it to a JS object with convertToJSON();
     * @example const req = await new RequestBuilder(api).addNation('Testlandia').sendRequestAsync()
     */
    RequestBuilder.prototype.sendRequestAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Check rate limit.
                    return [4 /*yield*/, this.execRateLimit()];
                    case 1:
                        // Check rate limit.
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, (0, node_fetch_1.default)(this.href, {
                                headers: {
                                    'User-Agent': this.API.userAgent,
                                }
                            })];
                    case 3:
                        res = _a.sent();
                        // Log request and update rate limit.
                        return [4 /*yield*/, this.logRequest(res)];
                    case 4:
                        // Log request and update rate limit.
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        err_1 = _a.sent();
                        throw new Error("Error sending request: " + err_1);
                    case 6: 
                    // Method chaining
                    return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * Saves the node-fetch response to the _response object within the instance.
     * @param res
     * @protected
     */
    RequestBuilder.prototype.logRequest = function (res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // Record the unix timestamp of the request for rate limiting.
                        this.API.lastRequestMs = Date.now();
                        // Handle IResponse
                        _a = this;
                        _b = {
                            fetchResponse: res,
                            unixTime: Date.now(),
                            statusCode: res.status,
                            statusBool: res.ok
                        };
                        return [4 /*yield*/, res.text()];
                    case 1:
                        // Handle IResponse
                        _a._response = (_b.body = _c.sent(),
                            _b);
                        return [2 /*return*/];
                }
            });
        });
    };
    RequestBuilder.prototype.convertToJSAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // Verifies if the a response has been set.
                        if (!this._response.body)
                            throw new Error("No response body could be found. You can examine the response body by doing: ");
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        _a = this._response;
                        return [4 /*yield*/, this.parseXml(this._response.body)];
                    case 2:
                        _a.js = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _b.sent();
                        throw new Error(err_2);
                    case 4: 
                    // Method chaining.
                    return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * Parses XML into a JSON object.
     * @author The xmLParser is based on the following written by Auralia:
     * https://github.com/auralia/node-nsapi/blob/master/src/api.ts#L25
     * @param {string} xml The XML to parse.
     * @return data promise returning a JSON object.
     */
    RequestBuilder.prototype.parseXml = function (xml) {
        return new Promise(function (resolve, reject) {
            exports.xmlParser.parseString(xml, function (err, data) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });
    };
    /**
     * Resets the url and shards to the default. Protected to allow extending into the NSMethods class.
     * End-users wishing to reset their URL should simply create a new RequestBuilder object instead.
     * @protected
     */
    RequestBuilder.prototype.resetURL = function () {
        // Resets the URL to the default.
        this._urlObj = new URL('https://www.nationstates.net/cgi-bin/api.cgi');
        // Empty the query string by overwriting the shards with an empty array.
        this._shards = [];
        // Method chaining
        return this;
    };
    return RequestBuilder;
}());
exports.RequestBuilder = RequestBuilder;
/**
 * Extends the RequestBuilder to allow authenticating with the NS API and accessing private shards.
 * No support for accessing private commands. Only shards.
 * @example const request = new PrivateRequestBuilder(api).authenticate('Testlandia', 'password');
 */
var PrivateRequestBuilder = /** @class */ (function (_super) {
    __extends(PrivateRequestBuilder, _super);
    function PrivateRequestBuilder(api) {
        var _this = _super.call(this, api) || this;
        _this._authentication = {
            status: false,
        };
        return _this;
    }
    Object.defineProperty(PrivateRequestBuilder.prototype, "authInfo", {
        /**
         * Returns the authentication information as an object.
         */
        get: function () {
            return this._authentication;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Retrieves the X-Pin value from NationStates and saves all information to the _authentication object.
     * Must be run before sending any requests.
     * @example const request = new PrivateRequestBuilder(api).authenticate('Testlandia', 'password');
     * @param {string} nation The nation to retrieve the X-Pin for.
     * @param {string} password The password for the nation.
     */
    PrivateRequestBuilder.prototype.authenticate = function (nation, password) {
        return __awaiter(this, void 0, void 0, function () {
            var req, res, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Set nation and password in authentication object, so that if the x-pin expires it can be re-retrieved.
                        this._authentication._nation = nation;
                        this._authentication._xPassword = password;
                        req = new PrivateRequestBuilder(this.API).addNation(nation).addShards('unread');
                        // Check rate limit
                        return [4 /*yield*/, this.execRateLimit()];
                    case 1:
                        // Check rate limit
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, (0, node_fetch_1.default)(req.href, {
                                headers: {
                                    'User-Agent': this.API.userAgent,
                                    'X-Password': password
                                }
                            })];
                    case 3:
                        res = _a.sent();
                        // Log request and update rate limit.
                        return [4 /*yield*/, this.logRequest(res)];
                    case 4:
                        // Log request and update rate limit.
                        _a.sent();
                        // Return the x-pin header.
                        this._authentication._xPin = res.headers.get('x-pin');
                        this._authentication.status = true;
                        return [3 /*break*/, 6];
                    case 5:
                        err_3 = _a.sent();
                        // Throw error.
                        throw new Error(err_3);
                    case 6: 
                    // Method chaining.
                    return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * Executes the request and saves the response to the RequestBuilder object.
     * Retrieve after awaiting it via .response, .body, or convert it to a JS object with convertToJSON();
     * Polymorph of RequestBuilder.
     */
    PrivateRequestBuilder.prototype.sendRequestAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Verifies that the authentication object is set.
                        if (!this._authentication.status) {
                            throw new Error('You must first authenticate! Run authenticate() on your private request before sending it.');
                        }
                        // Check rate limit.
                        return [4 /*yield*/, this.execRateLimit()];
                    case 1:
                        // Check rate limit.
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, (0, node_fetch_1.default)(this.href, {
                                headers: {
                                    'User-Agent': this.API.userAgent,
                                    'X-Pin': this._authentication._xPin,
                                }
                            })];
                    case 3:
                        res = _a.sent();
                        // Log request and update rate limit.
                        return [4 /*yield*/, this.logRequest(res)];
                    case 4:
                        // Log request and update rate limit.
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        err_4 = _a.sent();
                        throw new Error("Error sending request: " + err_4);
                    case 6: 
                    // Method chaining
                    return [2 /*return*/, this];
                }
            });
        });
    };
    return PrivateRequestBuilder;
}(RequestBuilder));
exports.PrivateRequestBuilder = PrivateRequestBuilder;
/**
 * As opposed to building requests manually, this class has built-in methods for easily accessing and handling
 * common information one looks for. You do not build, send, or parse requests manually.
 * @example const methods = new NSMethods(api);
 * @param { API } API The API object to enforce rate limiting and user agents.
 */
var NSMethods = /** @class */ (function (_super) {
    __extends(NSMethods, _super);
    function NSMethods(api) {
        return _super.call(this, api) || this;
    }
    /**
     * Returns a boolean response, if nation1 is endorsing nation2.
     * Does not modify the URL of the request.
     * @example console.log(await methods.isEndorsing('Testlandia', 'Testlandia')); // false
     * @param nation1 - The endorser.
     * @param nation2 - The endorsee.
     */
    NSMethods.prototype.isEndorsing = function (nation1, nation2) {
        return __awaiter(this, void 0, void 0, function () {
            var r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Reset the object's URL.
                        this.resetURL();
                        return [4 /*yield*/, this
                                .addNation(nation2.replace(/ /g, '_'))
                                .addShards('endorsements')
                                .sendRequestAsync()];
                    case 1: return [4 /*yield*/, (_a.sent())
                            .convertToJSAsync()];
                    case 2:
                        r = _a.sent();
                        console.log(r.js['endorsements']);
                        // Uses RegExp to verify if nation1 is in commma-seperated list of endorsements and returns the boolean.
                        return [2 /*return*/, new RegExp('(?:^|,)' + nation1.replace(/ /g, '_') + '(?:,|$)').test(r.js['endorsements'])];
                }
            });
        });
    };
    /**
     * Use the NS Verification API to verify the validity of a verification code.
     * Returns either a 0 or 1 as a number, as described in the NS API documentation.
     * @example console.log(await methods.verify('Testlandia', '12345')); // 0
     * @param nation
     * @param checksum
     * @param siteSpecificToken
     */
    NSMethods.prototype.verify = function (nation, checksum, siteSpecificToken) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Reset the object's URL.
                        this.resetURL();
                        // Add nation
                        this.addNation(nation.toLowerCase().replace(' ', '_'));
                        // Adds "a=verify" to the URL parameters.
                        this._urlObj.searchParams.append('a', 'verify');
                        // Adds checksum
                        this._urlObj.searchParams.append('checksum', checksum);
                        // Adds site specific token if it is set.
                        if (siteSpecificToken) {
                            this._urlObj.searchParams.append('token', siteSpecificToken);
                        }
                        // Get response
                        return [4 /*yield*/, this.sendRequestAsync()];
                    case 1:
                        // Get response
                        _a.sent();
                        // Return response as number.
                        return [2 /*return*/, parseInt(this._response.body)];
                }
            });
        });
    };
    /**
     * Download the nation data dump from the API.
     * Note that it can take a while to download the dump, especially for nations or when converting to JSON.
     * Future feature: Decode utf-8 within the dump.
     * @example methods.downloadDump('Testlandia', {extract: true, deleteXMLGz: true, deleteXML: true, convertToJson: true}); // Returns just a .json file
     * @param type -  Either 'nation' or 'region'
     * @param directoryToSave - The directory to save the dump to. Should be ended by a slash. Ex: "./downloads/"
     * @param options - If left blank, just downloads the {type}.xml.gz file.
     */
    NSMethods.prototype.downloadDumpAsync = function (type, directoryToSave, options) {
        return __awaiter(this, void 0, void 0, function () {
            var currentDate, fileName, res_1, fileStream_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // TODO: Implement decoding utf-8 within the dump.
                        // Verify if type is correct
                        if (type !== 'nations' && type !== 'regions')
                            throw new Error('Type must be either "nation" or "region"');
                        currentDate = new Date().toISOString().slice(0, 10);
                        fileName = directoryToSave + type + '.' + currentDate;
                        if (!!fs.existsSync(fileName + '.xml.gz')) return [3 /*break*/, 4];
                        // Check rate limit.
                        return [4 /*yield*/, this.execRateLimit()];
                    case 1:
                        // Check rate limit.
                        _a.sent();
                        return [4 /*yield*/, (0, node_fetch_1.default)("https://www.nationstates.net/pages/" + type + ".xml.gz", {
                                headers: {
                                    'User-Agent': this.API.userAgent
                                }
                            })];
                    case 2:
                        res_1 = _a.sent();
                        fileStream_1 = fs.createWriteStream(fileName + '.xml.gz');
                        // Synchronously write the file to the file stream.
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                res_1.body.pipe(fileStream_1);
                                res_1.body.on("error", reject);
                                fileStream_1.on("finish", resolve);
                            })];
                    case 3:
                        // Synchronously write the file to the file stream.
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!(options === null || options === void 0 ? void 0 : options.extract)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.gunzip(fileName + '.xml.gz', fileName + '.xml')];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        if (!(options === null || options === void 0 ? void 0 : options.convertToJson)) return [3 /*break*/, 10];
                        if (!!fs.existsSync(fileName + '.xml')) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.gunzip(fileName + '.xml.gz', fileName + '.xml')];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: 
                    // Convert the XML file to JSON.
                    return [4 /*yield*/, this.xmlToJson(fileName + '.xml', fileName + '.json')];
                    case 9:
                        // Convert the XML file to JSON.
                        _a.sent();
                        _a.label = 10;
                    case 10:
                        if (options === null || options === void 0 ? void 0 : options.deleteXMLGz)
                            fs.unlinkSync(fileName + '.xml.gz');
                        if (options === null || options === void 0 ? void 0 : options.deleteXML)
                            fs.unlinkSync(fileName + '.xml');
                        // Method chaining
                        return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * Extracts a gzipped file.
     * @param file
     * @param savePath
     * @private
     */
    NSMethods.prototype.gunzip = function (file, savePath) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Decompress the gzip file.
                    return [4 /*yield*/, new Promise(function (resolve) {
                            zlib.gunzip(fs.readFileSync(file), function (err, buffer) {
                                fs.writeFileSync(savePath, buffer);
                                resolve('Finished unzipping.');
                            });
                        })];
                    case 1:
                        // Decompress the gzip file.
                        _a.sent();
                        // Method chaining
                        return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * Converts an XML file to JSON and saves it to the specified path.
     * Uses the XML2Js library.
     * @param file
     * @param savePath
     * @private
     */
    NSMethods.prototype.xmlToJson = function (file, savePath) {
        return __awaiter(this, void 0, void 0, function () {
            var xml, json, _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        xml = fs.readFileSync(file, 'utf8');
                        json = fs.createWriteStream(savePath);
                        // Write JSON to file
                        _b = (_a = json).write;
                        _d = (_c = JSON).stringify;
                        return [4 /*yield*/, this.parseXml(xml)];
                    case 1:
                        // Write JSON to file
                        _b.apply(_a, [_d.apply(_c, [_e.sent()])]);
                        // Method Chaining
                        return [2 /*return*/, this];
                }
            });
        });
    };
    return NSMethods;
}(RequestBuilder));
exports.NSMethods = NSMethods;
/**
 * Dispatch modes
 */
var Mode;
(function (Mode) {
    Mode["add"] = "add";
    Mode["remove"] = "remove";
    Mode["edit"] = "edit";
})(Mode = exports.Mode || (exports.Mode = {}));
/**
 * Dispatch categories
 */
var Category;
(function (Category) {
    Category[Category["factbook"] = 1] = "factbook";
    Category[Category["bulletin"] = 3] = "bulletin";
    Category[Category["account"] = 5] = "account";
    Category[Category["meta"] = 8] = "meta";
})(Category = exports.Category || (exports.Category = {}));
/**
 * Dispatch factbook subcategories
 */
var Factbook;
(function (Factbook) {
    Factbook[Factbook["overview"] = 100] = "overview";
    Factbook[Factbook["history"] = 101] = "history";
    Factbook[Factbook["geography"] = 102] = "geography";
    Factbook[Factbook["culture"] = 103] = "culture";
    Factbook[Factbook["politics"] = 104] = "politics";
    Factbook[Factbook["legislation"] = 105] = "legislation";
    Factbook[Factbook["religion"] = 106] = "religion";
    Factbook[Factbook["military"] = 107] = "military";
    Factbook[Factbook["economy"] = 108] = "economy";
    Factbook[Factbook["international"] = 109] = "international";
    Factbook[Factbook["trivia"] = 110] = "trivia";
    Factbook[Factbook["miscellaneous"] = 111] = "miscellaneous";
})(Factbook = exports.Factbook || (exports.Factbook = {}));
/**
 * Dispatch bulletin subcategories
 */
var Bulletin;
(function (Bulletin) {
    Bulletin[Bulletin["policy"] = 305] = "policy";
    Bulletin[Bulletin["news"] = 315] = "news";
    Bulletin[Bulletin["opinion"] = 325] = "opinion";
    Bulletin[Bulletin["campaign"] = 385] = "campaign";
})(Bulletin = exports.Bulletin || (exports.Bulletin = {}));
/**
 * Dispatch account subcategories
 */
var Account;
(function (Account) {
    Account[Account["military"] = 505] = "military";
    Account[Account["trade"] = 515] = "trade";
    Account[Account["sport"] = 525] = "sport";
    Account[Account["drama"] = 535] = "drama";
    Account[Account["diplomacy"] = 545] = "diplomacy";
    Account[Account["science"] = 555] = "science";
    Account[Account["culture"] = 565] = "culture";
    Account[Account["other"] = 595] = "other";
})(Account = exports.Account || (exports.Account = {}));
/**
 * Dispatch meta subcategories
 */
var Meta;
(function (Meta) {
    Meta[Meta["subcategory"] = 835] = "subcategory";
    Meta[Meta["reference"] = 845] = "reference";
})(Meta = exports.Meta || (exports.Meta = {}));
/**
 * A class to handle creating, editing, and deleting dispatches in more high-level functions.
 * @example const methods = new Dispatch(api, 'nation', 'password', Mode.add);
 * @param { API } API The API object to enforce rate limiting and user agents.
 * @param { string } nation Your nation name without prefixes. Used for authenticating with the NationStates API.
 * @param { string } password Your password. Used for authenticating with the NationStates API.
 * @param { Mode } action Enumerator to specify the action to be taken.
 */
var Dispatch = /** @class */ (function (_super) {
    __extends(Dispatch, _super);
    function Dispatch(api, nation, password, action) {
        var _this = _super.call(this, api) || this;
        _this.API = api;
        _this.nation = nation;
        _this.password = password;
        _this.action = action;
        return _this;
    }
    /**
     * Set the dispatch mode. It can be either:
     * - 'add'
     * - 'remove'
     * - 'edit'<br><br>
     * See NationStates API documentation for more information.
     * @param method
     */
    Dispatch.prototype.addAction = function (method) {
        if (typeof method !== 'string')
            throw new Error('Action must be a string.');
        // Standardize
        method = method.toLowerCase().trim();
        // Only allow add, remove, and edit.
        var result = false;
        if (method === 'add')
            result = true;
        if (method === 'remove')
            result = true;
        if (method === 'edit')
            result = true;
        if (result) {
            this._urlObj.searchParams.append('dispatch', method);
            return;
        }
        // Otherwise, throw an error.
        throw new Error('You specified an incorrect dispatch method. Add, remove, or edit is valid.');
    };
    /**
     * Add title to the dispatch.
     * @param text
     */
    Dispatch.prototype.title = function (text) {
        // Type-checking
        if (typeof text !== 'string')
            throw new Error('The title must be a string.');
        // Append to URL.
        this._urlObj.searchParams.append('title', text);
        // Method Chaining
        return this;
    };
    /**
     * Add text to the dispatch.
     * @param text
     */
    Dispatch.prototype.text = function (text) {
        // Type-checking
        if (typeof text !== 'string')
            throw new Error('The text must be a string.');
        // Append to URL.
        this._urlObj.searchParams.append('text', text);
        // Method Chaining
        return this;
    };
    /**
     * Set the category of the dispatch.
     * @param category
     */
    Dispatch.prototype.category = function (category) {
        // Type-checking
        if (typeof (category) !== 'number')
            throw new Error('The category must be a number. See NationStates API documentation.');
        // Set the category
        this._urlObj.searchParams.append('category', category.toString());
        // Method chaining
        return this;
    };
    /**
     * Set the category of the dispatch.
     * @param subcategory
     */
    Dispatch.prototype.subcategory = function (subcategory) {
        // Type-checking
        if (typeof (subcategory) !== 'number')
            throw new Error('The category must be a number. See NationStates API documentation.');
        // Set the category
        this._urlObj.searchParams.append('subcategory', subcategory.toString());
        // Method chaining
        return this;
    };
    /**
     * Set the dispatch ID when editing or a removing a dispatch.
     * @param id
     */
    Dispatch.prototype.dispatchID = function (id) {
        // Type-checking
        if (typeof (id) !== 'number')
            throw new Error('The dispatch ID must be a number.');
        // Verify the action is edit or remove.
        if (this._urlObj.searchParams.get('dispatch') === 'add')
            throw new Error('The dispatch ID is only set when editing or removing dispatches..');
        // Append dispatch ID to URL.
        this._urlObj.searchParams.append('dispatchid', id.toString());
        // Method chaining
        return this;
    };
    /**
     * Obtain the x-pin of a nation.
     * @private
     */
    Dispatch.prototype.authenticate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var privateRequest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        privateRequest = new PrivateRequestBuilder(this.API);
                        return [4 /*yield*/, privateRequest.authenticate(this.nation, this.password)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, privateRequest._authentication._xPin];
                }
            });
        });
    };
    /**
     * Sends command asynchronously according to specifications with mode=prepare and mode=execute.
     * Returns true if success or throws an error.
     */
    Dispatch.prototype.executeAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var xPin, res, err_5, token, res, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authenticate()];
                    case 1:
                        xPin = _a.sent();
                        /*----- 2. Prepare Request -----*/
                        // Append prepare mode to the url to later retrieve the success token.
                        this.addNation(this.nation).addCustomParam('c', 'dispatch');
                        this.addAction(this.action);
                        this._urlObj.searchParams.append('mode', 'prepare');
                        // Send the request.
                        // Check rate limit.
                        return [4 /*yield*/, this.execRateLimit()];
                    case 2:
                        // Send the request.
                        // Check rate limit.
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 6, , 7]);
                        return [4 /*yield*/, (0, node_fetch_1.default)(this.href, {
                                headers: {
                                    'User-Agent': this.API.userAgent,
                                    'X-Pin': xPin
                                }
                            })];
                    case 4:
                        res = _a.sent();
                        // Log request and update rate limit.
                        return [4 /*yield*/, this.logRequest(res)];
                    case 5:
                        // Log request and update rate limit.
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        err_5 = _a.sent();
                        throw new Error("Error sending request: " + err_5);
                    case 7: return [4 /*yield*/, this.convertToJSAsync()];
                    case 8:
                        token = (_a.sent()).js['success'];
                        /*----- 3. Execute Request Request -----*/
                        // Replace prepare mode from the url with execute and append success token.
                        this._urlObj.searchParams.set('mode', 'execute');
                        this._urlObj.searchParams.append('token', token);
                        // Rate limit
                        return [4 /*yield*/, this.execRateLimit()];
                    case 9:
                        // Rate limit
                        _a.sent();
                        _a.label = 10;
                    case 10:
                        _a.trys.push([10, 13, , 14]);
                        return [4 /*yield*/, (0, node_fetch_1.default)(this.href, {
                                headers: {
                                    'User-Agent': this.API.userAgent,
                                    'X-Pin': xPin
                                }
                            })];
                    case 11:
                        res = _a.sent();
                        // Log request and update rate limit.
                        return [4 /*yield*/, this.logRequest(res)];
                    case 12:
                        // Log request and update rate limit.
                        _a.sent();
                        return [3 /*break*/, 14];
                    case 13:
                        err_6 = _a.sent();
                        throw new Error("Error sending request: " + err_6);
                    case 14: return [2 /*return*/, true];
                }
            });
        });
    };
    return Dispatch;
}(RequestBuilder));
exports.Dispatch = Dispatch;
//# sourceMappingURL=API.js.map
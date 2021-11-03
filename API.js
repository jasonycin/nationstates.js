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
exports.NSFunctions = exports.RequestBuilder = exports.API = void 0;
// Node-fetch v.2.6.5. Supported by developers.
var node_fetch_1 = require("node-fetch");
var node_fetch_2 = require("node-fetch");
// Filesystem
var fs = require("fs");
// Xml2js v.0.4.23
var xml2js = require("xml2js");
// Zlib
var zlib = require("zlib");
/**
 * Required for all other classes. Defines the configuration of the library and is used to enforce rate limits and user agents.
 */
var API = /** @class */ (function () {
    /**
     * Instance must be instantiated with a user agent string. Setting a custom rate limit is optional.
     * @param {string} userAgent
     * @param {number} rateLimit
     */
    function API(userAgent, rateLimit) {
        this._rateLimit = 650;
        this._authentication = {
            status: false,
        };
        this.userAgent = userAgent; // Uses setter
        // If optional rate limit parameter was input.
        if (rateLimit) {
            // Uses setter if optional parameter was input.
            this.rateLimit = rateLimit;
        }
    }
    Object.defineProperty(API.prototype, "userAgent", {
        /**
         * Retrieves the user agent string.
         */
        get: function () {
            return this._userAgent;
        },
        /**
         * Sets the user agent. Verifies the parameter length if less than three, is alphanumeric,
         * does not end in an empty space, and is a string.
         * @param {string} userAgent
         */
        set: function (userAgent) {
            if ( // Minimum length
            userAgent.length < 3 ||
                // Must be alphanumeric, or only alpha, or only numeric
                !userAgent.match(/^([0-9]|[a-z])+([0-9a-z]+)$/i) ||
                // Last character cannot be a space
                userAgent.slice(-1) === ' ' ||
                // Data type is string.
                typeof (userAgent) !== 'string') {
                // Throw error.
                throw new Error("You submitted an invalid user agent: " + userAgent);
            }
            // Set user agent.
            this._userAgent = "User-Agent: " + userAgent + ". Using API wrapper written by Heaveria.";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(API.prototype, "rateLimit", {
        /**
         * Returns the current rate limit as a string.
         */
        get: function () {
            return this._rateLimit;
        },
        /**
         * Set the rateLimit of the instance. Verifies that the input is a number and is >= 650.
         * @param {number} ms - The number of milliseconds to set the rateLimit to.
         */
        set: function (ms) {
            // Check minimum rate limit and data type.
            if (ms < 650 || typeof (ms) !== 'number') {
                // If true, throw error.
                throw new Error("You submitted an invalid rate limit: " + ms + "ms. Must be equal to or higher than 650.");
            }
            // Set rate limit.
            this._rateLimit = ms;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(API.prototype, "lastRequestMs", {
        /**
         * Returns the last request time in milliseconds.
         */
        get: function () {
            // Verify is the property has been set.
            //if (!API._lastRequestMs) {
            // Throw error.
            //throw new Error('You have not made a request yet.');
            //}
            // Return the last request time.
            return API._lastRequestMs;
        },
        /**
         * Set the time of the last request in milliseconds.
         * @example api.lastRequestMs = Date.now();
         * @param ms
         */
        set: function (ms) {
            // Data type checking and value checking
            if (typeof (ms) !== 'number' || ms <= 0) {
                // Throw Error
                throw new Error('Parameter must be a number.');
            }
            // Set the last request time.
            API._lastRequestMs = ms;
        },
        enumerable: false,
        configurable: true
    });
    API.prototype.authenticate = function (nation, password) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this._authentication;
                        return [4 /*yield*/, new RequestBuilder(this)
                                .addNation(nation)
                                .addShards('unread')
                                .getXPin(password)];
                    case 1:
                        _a._xPin =
                            _b.sent();
                        this._authentication.status = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    API.version = '0.0.1-alpha';
    return API;
}());
exports.API = API;
/*---------------------------------------------*/
/**
 * @author The xmLParser is based on the following written by Auralia:
 * https://github.com/auralia/node-nsapi/blob/master/src/api.ts#L25
 * @hidden
 */
var xmlParser = new xml2js.Parser({
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
 * A object that is used to:
 * - (1) Define the architecture of a https request before it sent to the API.
 * - (2) Access and modify the response of a request.
 * @example let request = await new RequestBuilder(api).addNation('testlandia').sendRequestAsync();
 */
var RequestBuilder = /** @class */ (function () {
    function RequestBuilder(API) {
        this._url = new URL('https://www.nationstates.net/cgi-bin/api.cgi');
        this._headers = new node_fetch_1.Headers();
        this._shards = [];
        this.API = API;
        this._headers.set('User-Agent', this.API.userAgent);
    }
    Object.defineProperty(RequestBuilder.prototype, "headers", {
        get: function () {
            var headers = {
                'User-Agent': this.API.userAgent
            };
            if (this.API._authentication.status) {
                headers['X-Pin'] = this.API._authentication._xPin;
            }
            return headers;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RequestBuilder.prototype, "body", {
        /**
         * Returns the current body located in the response of a RequestBuilder object.
         */
        get: function () {
            // Verifies if a response has been recieved.
            if (!this._response) {
                throw new Error('No body found. Have you sent and awaited your request via sendRequestAsync()?');
            }
            // If the body is a number, convert the string to a number and return it. Else returns the body as is.
            return !isNaN(this._response.body) ? this._response.body : parseInt(this._response.body);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RequestBuilder.prototype, "json", {
        /**
         * Returns the current JSON located in the response of a RequestBuilder object.
         * A conversion to JSON beforehand is required.
         * @example (1) let request = await new RequestBuilder(api).addNation('testlandia').sendRequestAsync();
         * (2) request.convertToJSON();
         * (3) console.log(request.json);
         */
        get: function () {
            if (!this._response.json) {
                throw new Error('No JSON found. Try convertToJsonAsync() first.');
            }
            return this._response.json;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RequestBuilder.prototype, "shards", {
        /**
         * Returns the current shards of a RequestBuilder object as a single string or as an array of strings.
         */
        get: function () {
            // Verifies if shards have been added.
            if (!this._shards) {
                throw new Error('No shards have been added.');
            }
            // If there is only a single shard, return it.
            if (this._shards.length === 1) {
                return this._shards[0];
            }
            // Returns the array of shards.
            return this._shards;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Adds the nation to the url parameters.
     * @example addNation('Testlandia') adds 'nation=Testlandia' to the url.
     * @param name - The name of the nation from which data is retrieved.
     */
    RequestBuilder.prototype.addNation = function (name) {
        if ( // Minimum length
        name.length < 3 ||
            // Must be alphanumeric, or only alpha, or only numeric
            !name.match(/^([0-9]|[a-z])+([0-9a-z]+)$/i) ||
            // Last character cannot be a space
            name.slice(-1) === ' ' ||
            // Data type is string.
            typeof (name) !== 'string') {
            throw new Error("You submitted an invalid nation name: " + name);
        }
        this._url.searchParams.append('nation', name);
        // Method chaining.
        return this;
    };
    RequestBuilder.prototype.addRegion = function (name) {
        this._url.searchParams.append('region', name);
        // Method chaining.
        return this;
    };
    RequestBuilder.prototype.addCouncilID = function (id) {
        if (id > 2 || id < 0) {
            throw new Error('Invalid ID. 1 = GA, 2 = SC.');
        }
        this._url.searchParams.append('wa', id.toString());
        // Method chaining.
        return this;
    };
    RequestBuilder.prototype.addShards = function (shards) {
        switch (typeof (shards)) {
            // If only a single shard is given, push it to the class _shards[].
            case "string":
                this._shards.push(shards);
                break;
            // If array of strings, then push each string to the class _shards[].
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
        if (this._url.searchParams.has('q')) {
            this._url.searchParams.delete('q');
        }
        // Add shards[] to URL.
        this._url.searchParams.append('q', this._shards.join('+'));
        // Method chaining
        return this;
    };
    /**
     * Removes all shards from the RequestBuilder object and its associated URL.
     * @example new RequestBuilder(api).addShards('numnations').removeShards()
     */
    RequestBuilder.prototype.deleteAllShards = function () {
        this._url.searchParams.delete('q');
        this._shards.length = 0;
    };
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
     * Download the nation data dump from the API.
     * @example await new Request(API).downloadNationDumpAsync('./{FILENAME}.xml.gz');
     * @param pathToSaveFile
     */
    /**
     * Download the regions data dump from the API.
     * @example await new Request(API).downloadRegionDumpAsync('./{FILENAME}.xml.gz');
     * @param pathToSaveFile
     */
    RequestBuilder.prototype.downloadRegionDumpAsync = function (pathToSaveFile) {
        return __awaiter(this, void 0, void 0, function () {
            var res, fileStream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Check rate limit.
                    return [4 /*yield*/, this.execRateLimit()];
                    case 1:
                        // Check rate limit.
                        _a.sent();
                        return [4 /*yield*/, node_fetch_2.default('https://www.nationstates.net/pages/regions.xml.gz', {
                                headers: {
                                    'User-Agent': this.API.userAgent
                                }
                            })];
                    case 2:
                        res = _a.sent();
                        fileStream = fs.createWriteStream(pathToSaveFile);
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                res.body.pipe(fileStream);
                                res.body.on("error", reject);
                                fileStream.on("finish", resolve);
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
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
                        return [4 /*yield*/, node_fetch_2.default(this._url.href, {
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
    RequestBuilder.prototype.logRequest = function (res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // Record the unix timestamp of the request for rate limiting.
                        this.API.lastRequestMs = Date.now();
                        // Handle Response
                        _a = this;
                        _b = {
                            fetchResponse: res,
                            unixTime: Date.now(),
                            statusCode: res.status,
                            statusBool: res.ok
                        };
                        return [4 /*yield*/, res.text()];
                    case 1:
                        // Handle Response
                        _a._response = (_b.body = _c.sent(),
                            _b);
                        return [2 /*return*/];
                }
            });
        });
    };
    RequestBuilder.prototype.getJSON = function () {
        if (!this._response.json) {
            throw new Error('No JSON found. Try convertToJsonAsync() first.');
        }
        return this._response.json;
    };
    RequestBuilder.prototype.convertToJsonAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // Verifies if the a response has been set.
                        if (!this._response.body) {
                            throw new Error("No response body could be found. You can examine the response body by doing: ");
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        _a = this._response;
                        return [4 /*yield*/, this.parseXml(this._response.body)];
                    case 2:
                        _a.json = _b.sent();
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
            xmlParser.parseString(xml, function (err, data) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });
    };
    /**
     * TODO: DOES NOT WORK. Needs to be developed and implemented.
     * @param password
     */
    RequestBuilder.prototype.getXPin = function (password) {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Add password to headers.
                        this._headers.append('X-Password', password);
                        console.log(JSON.stringify(this.headers));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, node_fetch_2.default(this._url.href, {
                                headers: JSON.stringify(this.headers)
                            })];
                    case 2:
                        res = _a.sent();
                        // Log request and update rate limit.
                        return [4 /*yield*/, this.logRequest(res)];
                    case 3:
                        // Log request and update rate limit.
                        _a.sent();
                        // Return the x-pin header.
                        return [2 /*return*/, res.headers.get('x-pin')];
                    case 4:
                        err_3 = _a.sent();
                        // Remove the wrong password from the headers.
                        this._headers.delete('X-Password');
                        // Throw error.
                        throw new Error(err_3);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Resets the url and shards to the default. Protected to allow extending into the NSFunctions class.
     * End-users wishing to reset their URL should simply create a new RequestBuilder object instead.
     * @protected
     */
    RequestBuilder.prototype.resetURL = function () {
        // Resets the URL to the default.
        this._url = new URL('https://www.nationstates.net/cgi-bin/api.cgi');
        // Empty the query string by overwriting the shards with an empty array.
        this._shards = [];
        // Method chaining
        return this;
    };
    return RequestBuilder;
}());
exports.RequestBuilder = RequestBuilder;
/**
 * As opposed to building requests manually, this class has built-in methods for easily accessing and handling
 * common information one looks for. You do not build, send, or parse requests manually.
 * @param { API } API The API object to enforce rate limiting and user agents.
 */
var NSFunctions = /** @class */ (function (_super) {
    __extends(NSFunctions, _super);
    function NSFunctions(api) {
        return _super.call(this, api) || this;
    }
    /**
     * Returns a boolean response, if nation1 is endorsing nation2.
     * Does not modify the URL of the request.
     * @param nation1 - The nation to check if it is endorsing nation2.
     * @param nation2
     */
    NSFunctions.prototype.isEndorsing = function (nation1, nation2) {
        return __awaiter(this, void 0, void 0, function () {
            var r, endorsements, _i, endorsements_1, nation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Reset the object's URL.
                        this.resetURL();
                        return [4 /*yield*/, this
                                .addNation(nation2)
                                .addShards('endorsements')
                                .sendRequestAsync()];
                    case 1: return [4 /*yield*/, (_a.sent())
                            .convertToJsonAsync()];
                    case 2:
                        r = _a.sent();
                        endorsements = r.json['endorsements'].split(',');
                        // Check if nation1 is endorsed by nation2.
                        for (_i = 0, endorsements_1 = endorsements; _i < endorsements_1.length; _i++) {
                            nation = endorsements_1[_i];
                            // Return true if nation1 is endorsed by nation2.
                            if (nation === nation1) {
                                this.resetURL();
                                return [2 /*return*/, true];
                            }
                        }
                        // If nation1 is not endorsed by nation2, return false.
                        return [2 /*return*/, false];
                }
            });
        });
    };
    /**
     * Use the NS Verification API to verify the validity of a verifcation code.
     * Returns either a 0 or 1 as a number, as described in the NS API documentation.
     * @param nation
     * @param checksum
     */
    NSFunctions.prototype.verify = function (nation, checksum) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Reset the object's URL.
                        this.resetURL();
                        // Add nation
                        this.addNation(nation);
                        // Adds "a=verify" to the URL parameters.
                        this._url.searchParams.append('a', 'verify');
                        // Adds
                        this._url.searchParams.append('checksum', checksum);
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
     * Future feature: Decode utf-8 within the dump.
     * @param type -  Either 'nation' or 'region'
     * @param directoryToSave - The directory to save the dump to. Should be ended by a slash. Ex: "./downloads/"
     * @param options
     */
    NSFunctions.prototype.downloadDumpAsync = function (type, directoryToSave, options) {
        return __awaiter(this, void 0, void 0, function () {
            var currentDate, fileName, res, fileStream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // TODO: Implement decoding utf-8 within the dump.
                        // Verify if type is correct
                        if (type !== 'nations' && type !== 'regions') {
                            throw new Error('Type must be either "nation" or "region"');
                        }
                        currentDate = new Date().toISOString().slice(0, 10);
                        fileName = directoryToSave + type + '.' + currentDate;
                        // Check rate limit.
                        return [4 /*yield*/, this.execRateLimit()];
                    case 1:
                        // Check rate limit.
                        _a.sent();
                        return [4 /*yield*/, node_fetch_2.default("https://www.nationstates.net/pages/" + type + ".xml.gz", {
                                headers: {
                                    'User-Agent': this.API.userAgent
                                }
                            })];
                    case 2:
                        res = _a.sent();
                        fileStream = fs.createWriteStream(fileName + '.xml.gz');
                        // Synchronously write the file to the file stream.
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                res.body.pipe(fileStream);
                                res.body.on("error", reject);
                                fileStream.on("finish", resolve);
                            })];
                    case 3:
                        // Synchronously write the file to the file stream.
                        _a.sent();
                        if (!(options === null || options === void 0 ? void 0 : options.extract)) return [3 /*break*/, 5];
                        // Extract the file to XML.
                        return [4 /*yield*/, this.gunzip(fileName + '.xml.gz', fileName + '.xml')];
                    case 4:
                        // Extract the file to XML.
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        if (!(options === null || options === void 0 ? void 0 : options.convertToJson)) return [3 /*break*/, 9];
                        if (!!fs.existsSync(fileName + '.xml')) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.gunzip(fileName + '.xml.gz', fileName + '.xml')];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: 
                    // Convert the XML file to JSON.
                    return [4 /*yield*/, this.xmlToJson(fileName + '.xml', fileName + '.json')];
                    case 8:
                        // Convert the XML file to JSON.
                        _a.sent();
                        _a.label = 9;
                    case 9:
                        if (options === null || options === void 0 ? void 0 : options.deleteXMLGZ) {
                            // Delete the original xml.gz file.
                            fs.unlinkSync(fileName + '.xml.gz');
                        }
                        if (options === null || options === void 0 ? void 0 : options.deleteXML) {
                            // Delete the unzipped .xml file.
                            fs.unlinkSync(fileName + '.xml');
                        }
                        // Method chaining
                        return [2 /*return*/, this];
                }
            });
        });
    };
    NSFunctions.prototype.gunzip = function (file, savePath) {
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
    NSFunctions.prototype.xmlToJson = function (file, savePath) {
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
    return NSFunctions;
}(RequestBuilder));
exports.NSFunctions = NSFunctions;
//# sourceMappingURL=API.js.map
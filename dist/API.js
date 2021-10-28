"use strict";
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
exports.NSRequest = exports.API = void 0;
// Node-fetch v.2.6.5. Supported by developers.
var node_fetch_1 = require("node-fetch");
// Filesystem
var fs = require("fs");
// Xml2js v.0.4.23
var xml2js = require("xml2js");
var API = /** @class */ (function () {
    /**
     * Instance must be instantiated with a user agent string. Setting a custom rate limit is optional.
     * @param {string} userAgent
     * @param {number} rateLimit
     */
    function API(userAgent, rateLimit) {
        this.status = false;
        this._rateLimit = 650;
        this.status = true;
        this.userAgent = userAgent; // Uses setter
        // Uses setter if optional parameter was input.
        if (rateLimit) {
            this.rateLimit = rateLimit;
        }
    }
    Object.defineProperty(API.prototype, "userAgent", {
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
                throw new Error("You submitted an invalid user agent: " + userAgent);
            }
            this._userAgent = userAgent;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(API.prototype, "rateLimit", {
        /**
         * Returns the current rate limit as a string.
         */
        get: function () {
            return "Current rate limit: " + this._rateLimit.toString() + "ms";
        },
        /**
         * Set the rateLimit of the instance. Verifies that the input is a number and is >= 650.
         * @param {number} ms - The number of milliseconds to set the rateLimit to.
         */
        set: function (ms) {
            // Check minimum rate limit and data type.
            if (ms < 650 || typeof (ms) !== 'number') {
                throw new Error("You submitted an invalid rate limit: " + ms + "ms. Must be equal to or higher than 650.");
            }
            this._rateLimit = ms;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(API.prototype, "rawRateLimit", {
        get: function () {
            return this._rateLimit;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(API.prototype, "lastRequest", {
        get: function () {
            return this._lastRequestMs;
        },
        set: function (ms) {
            if (typeof (ms) !== 'number' || ms <= 0) {
                throw new Error('Parameter must be a number.');
            }
            this._lastRequestMs = ms;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns the number of milliseconds since the last request.
     * @private
     */
    API.prototype.calcMsSinceLastRequest = function () {
        if (!this._lastRequestMs) {
            throw new Error('A former request does not exist or has not been set.');
        }
        return Date.now() - this._lastRequestMs;
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
 * @class
 * @example let request = await new NSRequest(api).addNation('testlandia').sendRequestAsync();
 */
var NSRequest = /** @class */ (function () {
    function NSRequest(API) {
        this._url = new URL('https://www.nationstates.net/cgi-bin/api.cgi');
        this._shards = [];
        this.API = API;
    }
    Object.defineProperty(NSRequest.prototype, "body", {
        /**
         * Returns the current body located in the response of a NSRequest object.
         */
        get: function () {
            // Verifies if a response has been recieved.
            if (!this._response) {
                throw new Error('No body found. Have you sent and awaited your request via sendRequestAsync()?');
            }
            // Return the body of the response.
            return this._response.body;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NSRequest.prototype, "json", {
        /**
         * Returns the current JSON located in the response of a NSRequest object.
         * A conversion to JSON beforehand is required.
         * @example (1) let request = await new NSRequest(api).addNation('testlandia').sendRequestAsync();
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
    Object.defineProperty(NSRequest.prototype, "shards", {
        /**
         * Returns the current shards of a NSRequest object as a single string or as an array of strings.
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
    NSRequest.prototype.addNation = function (name) {
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
    NSRequest.prototype.addRegion = function (name) {
        this._url.searchParams.append('region', name);
        // Method chaining.
        return this;
    };
    NSRequest.prototype.addCouncilID = function (id) {
        if (id !== 1 || 2) {
            throw new Error('Invalid ID. 1 = GA, 2 = SC.');
        }
        this._url.searchParams.append('wa', id.toString());
        // Method chaining.
        return this;
    };
    NSRequest.prototype.addShards = function (shards) {
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
     * Removes all shards from the NSRequest object and its associated URL.
     * @example new NSRequest(api).addShards('numnations').removeShards()
     */
    NSRequest.prototype.deleteAllShards = function () {
        this._url.searchParams.delete('q');
        this._shards.length = 0;
    };
    NSRequest.prototype.execRateLimit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var difference, timeToWait_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        difference = Date.now() - this.API.lastRequest;
                        if (!(this.API.rawRateLimit > difference)) return [3 /*break*/, 2];
                        timeToWait_1 = this.API.rawRateLimit - difference;
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
    NSRequest.prototype.downloadNationDumpAsync = function (pathToSaveFile) {
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
                        return [4 /*yield*/, node_fetch_1.default('https://www.nationstates.net/pages/nations.xml.gz')];
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
    /**
     * Download the regions data dump from the API.
     * @example await new Request(API).downloadRegionDumpAsync('./{FILENAME}.xml.gz');
     * @param pathToSaveFile
     */
    NSRequest.prototype.downloadRegionDumpAsync = function (pathToSaveFile) {
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
                        return [4 /*yield*/, node_fetch_1.default('https://www.nationstates.net/pages/regions.xml.gz', {
                                headers: {
                                    'User-Agent': "API written by Heaveria. In-use by: " + this.API._userAgent
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
    NSRequest.prototype.sendRequestAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, _a, err_1;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: 
                    // Check rate limit.
                    return [4 /*yield*/, this.execRateLimit()];
                    case 1:
                        // Check rate limit.
                        _c.sent();
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, node_fetch_1.default(this._url.href, {
                                headers: {
                                    'User-Agent': "API written by Heaveria. In-use by: " + this.API._userAgent
                                }
                            })];
                    case 3:
                        res = _c.sent();
                        // Record the unix timestamp of the request for rate limiting.
                        this.API.lastRequest = Date.now();
                        // Handle Response
                        _a = this;
                        _b = {
                            unixTime: Date.now(),
                            statusCode: res.status,
                            statusBool: res.ok
                        };
                        return [4 /*yield*/, res.text()];
                    case 4:
                        // Handle Response
                        _a._response = (_b.body = _c.sent(),
                            _b);
                        return [3 /*break*/, 6];
                    case 5:
                        err_1 = _c.sent();
                        throw new Error(err_1);
                    case 6: 
                    // Method chaining
                    return [2 /*return*/, this];
                }
            });
        });
    };
    NSRequest.prototype.getJSON = function () {
        if (!this._response.json) {
            throw new Error('No JSON found. Try convertToJsonAsync() first.');
        }
        return this._response.json;
    };
    NSRequest.prototype.convertToJsonAsync = function () {
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
    NSRequest.prototype.parseXml = function (xml) {
        return new Promise(function (resolve, reject) {
            xmlParser.parseString(xml, function (err, data) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });
    };
    return NSRequest;
}());
exports.NSRequest = NSRequest;
//# sourceMappingURL=API.js.map
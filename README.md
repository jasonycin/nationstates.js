| [![CodeQL](https://github.com/heaveria-ns/nationstates.js/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/heaveria-ns/nationstates.js/actions/workflows/codeql-analysis.yml) | ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) | ![IntelliJJ IDEA](https://img.shields.io/badge/IntelliJIDEA-000000.svg?style=for-the-badge&logo=intellij-idea&logoColor=white) | ![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white) |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|

# NationStates.js | client Wrapper
### Version: 1.0.0 | [📖 Documentation](https://heaveria-ns.github.io/nationstates.js/)

NationsStates.js is a **wrapper** to ease accessing the NationStates client through **method-chaining** and other abstractions. 
Additional **built-in methods for common tasks** are also included.

This wrapper takes care of enforcing the rate limit, conversions to JS objects, and allowing usage of async/await.

| ㅤ   | Feature                           | Note                                                                                                                                                                                                            |
|-----|-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ✅   | Rate limit                        | Built-in to 650ms. Can be raised, but **not** lowered.                                                                                                                                                          |
| ✅   | Dumps                             | Support for easily downloading, unzipping, and converting to JSON. See [NSMethods](#nsmethods) and the [documentation](https://heaveria-ns.github.io/nationstates.js/classes/NSMethods.html#downloadDumpAsync). |
| ✅   | Nations client                       | See [Nation](#nation) (recommended) or [RequestBuilder](#requestbuilder)                                                                                                                                        |
| ✅   | Regions client                       | See [Region](#region) (recommended) or [RequestBuilder](#requestbuilder)                                                                                                                                        |
| ✅   | World client                         | See [RequestBuilder](#requestbuilder).                                                                                                                                                                          |
| ✅   | World Assembly client                | See [RequestBuilder](#requestbuilder).                                                                                                                                                                          |
| ❌   | Telegrams                         | Future support planned.                                                                                                                                                                                         |
| 🟡  | Trading Cards client                 | See [RequestBuilder](#requestbuilder). Requires use of [addCustomParam](https://heaveria-ns.github.io/nationstates.js/classes/RequestBuilder.html#addCustomParam).                                              |
| ✅   | Verification client                  | Built-in functions to simplify process. No support for site-specific tokens. Use [NSMethods](#nsmethods) (recommended) or  [RequestBuilder](#requestbuilder).                                                   |
| ✅   | Private shards                    | See [PrivateRequestBuilder](#privaterequestbuilder).                                                                                                                                                            |
| 🟡  | Private commands                  | See [Dispatches](#dispatches). No support for `issues` or `giftcards`.                                                                                                                                          |
| ✅   | Built-in methods for common tasks | See [NSMethods](#nsmethods).                                                                                                                                                                                    |
| 🟡  | Browser support                   | [Yes](#browser_support), but not guaranteed.                                                                                                                                                                    |

## Installation / Setup
### 1. Installation
While in your projects' directory run the following command in the terminal to install the library:
```
npm i nationstates.js
```

### 2. Import/Require the library

```TypeScript
// For TypeScript, you can use the following import statement (Recommended):
import * as ns from 'nationstates.js/client';

// For standard JavaScript:
const ns = require('nationstates.js');
```

### 3. Initialize
```TypeScript
/**
 * 1. Instantiate a Client object.
 * TODO: Ensure to replace the user-agent. This is usually the name of your own nation.
 *       This allows NationStates servers to recognize you.
 */
const client = new ns.Client('user-Agent');
```

## Nation
➡ [Documentation](https://heaveria-ns.github.io/nationstates.js/classes/Nation.html)

All public shards for a nation are fetched and stored in a returned `Promise<NationResult>` 
after awaiting `init()`.
### Example:
```TypeScript
const nation = await new ns.Nation(client, 'nationName').init();
console.log(nation.happenings, nation.population); // Whatever shard you want!
```

## Region
➡ [Documentation](https://heaveria-ns.github.io/nationstates.js/classes/Region.html)

All public shards for a region are fetched and stored in a returned `Promise<RegionResult>`
after awaiting `init()`.
### Example:
```TypeScript
const region = await new ns.Region(client, 'regionName').init();
console.log(region.messages, region.history); // Whatever shard you want!
```


## RequestBuilder
➡ [Documentation](https://heaveria-ns.github.io/nationstates.js/classes/RequestBuilder.html)  
➡ For private shards use [PrivateRequestBuilder](#privaterequestbuilder).
### Example:
In this example, we will get Testlandia's flag and population as a JS object.
#### 1. Instantiate Object
```TypeScript
const req = new ns.RequestBuilder(client);
```

#### 2. Build and send the request.
```TypeScript
await req.addNation('testlandia') // nation=testlandia
         .addShards(['flag', 'population']) // q=flag+population
         .execute(); // Asynchronously execute the request.

// Convert the result to a JS object (optional).
const json = await req.toJS();
```
### 3. See the result!
You are responsible for traversing the result. This is approximately what the json response will look like:
```JSON
{
  "id": "testlandia",
  "population": 39561,
  "flag": "https://www.nationstates.net/images/flags/Iran.svg"
}
```
```TypeScript
console.log(json) // See above
console.log(json['flag']); // https://www.nationstates.net/images/flags/Iran.svg
console.log(json['population']); // 39561
```

## PrivateRequestBuilder
➡ [Documentation](https://heaveria-ns.github.io/nationstates.js/classes/PrivateRequestBuilder.html)

### Instructions
This class extends the [RequestBuilder](#requestbuilder) and functions the same.  
But in order to send any request, you must **first authenticate()** 
in order to get the x-pin and allow for quick repeated requests:

```TypeScript
const privReq = new ns.PrivateRequestBuilder(client);
// You must authenticate. This retrieves the x-pin and allows for quick repeated requests.
await privReq.authenticate('nation', 'password')
```

### Notice
⚠️⛔️ **Will not work if you did not authenticate().**

## NSMethods
➡ [Documentation](https://heaveria-ns.github.io/nationstates.js/classes/NSMethods.html)

| Feature                                        | Purpose                                                                                                                                                            |
|------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `verify(nation, checksum, siteSpecificToken?)` | [Verify](https://www.nationstates.net/pages/api.html#verification) the checksum of a nation using. Returns a 0 or 1. You may optionally add a site-specific token. |
| `downloadDumpAsync(type, directory, options?)` | Download data dumps. For options, see [IDumpOptions](https://heaveria-ns.github.io/nationstates.js/interfaces/DumpOptions.html).                                   |
| `isEndorsing(nation1, nation2)`                | Verifies if `nation1` is endorsing `nation2`. Returns a boolean.                                                                                                   |

### Example:
```TypeScript
const nsFun = new ns.NSMethods(client);

let endoResult = await nsFun.isEndorsing('Testlandia', 'Olvaria'); // Is Testlandia endorsing Olvaria?

console.log(endoResult) // 0
```

## Private Commands
➡ [Dispatch Documentation](https://heaveria-ns.github.io/nationstates.js/classes/Dispatch.html)
### Dispatches
An easy way to interact with the NationStates Private Commands and add, remove, or edit dispatches in a high-level way.
Enumerators have also been provided for `mode`, `category`, `subcategory` for ease of use.
Here are some examples:
#### 1. Adding a dispatch
```TypeScript
await new ns.Dispatch(client, 'nation', 'password', ns.Mode.add) 
    .title('Cool Title!')
    .text('Hello World!')
    .category(ns.Category.factbook)
    .subcategory(ns.Factbook.legislation)
    .execute();
```

#### 2. Removing a dispatch
```TypeScript
await new ns.Dispatch(client, 'nation', 'password', ns.Mode.remove)
    .dispatchID(12345)
    .execute();
```

#### 3. Editing a dispatch
```TypeScript
await new ns.Dispatch(client, 'nation', 'password', ns.Mode.edit)
    .dispatchID(1630710)
    .title('Edited Title')
    .text('Hello World!')
    .category(ns.Category.bulletin)
    .subcategory(ns.Bulletin.news)
    .execute();
```

#### 4. Check for success/failure
```TypeScript
const result = await new ns.Dispatch(client, 'nation', 'password', ns.Mode.remove)
    .dispatchID(12345)
    .execute();
console.log(result.response.statusBool, result.response.statusCode, result.response.body);
```

⚠️ There is no support for `issue` or `giftcard` private commands.

## Browser Support
Browser support is **not** guarenteed but possible using [Browserify](https://browserify.org/).
Here's how:
1. Create a new Node.js project.
2. Create a new `index.js` file and run `npm install nationstates.js`.
3. Require the library in your `index.js`:
```JavaScript
const ns = require('nationstates.js');
```
4. Now install Browserify: `npm install -g browserify`.
5. Now we can convert our `.js` file to a `.js` file that can be run in a browser. The following command recursively 
finds all require() statements and bundles them together in a `browser.js` file. It outputs `ns` as a global variable which you use to access thelibrary:
`browserify index.js -o --standalone ns > browser.js`
6. The following should now work in the browser:
```HTML
<script src="browser.js">
    const api = ns.Client('user-agent');
    // Rest of your script here...
</script>
```

## Contact / Questions
If you've encountered any issue, have feature requests, or need support using this client please feel free to reach
out to me at anytime! Preferably on Discord at Heaveria#6413. Otherwise, send me a telegram.

Cheers,  
[Heaveria](https://www.nationstates.net/nation=heaveria)  👋🏻

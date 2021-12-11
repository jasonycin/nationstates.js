| [![CodeQL](https://github.com/heaveria-ns/nationstates.js/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/heaveria-ns/nationstates.js/actions/workflows/codeql-analysis.yml) | ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) | ![IntelliJJ IDEA](https://img.shields.io/badge/IntelliJIDEA-000000.svg?style=for-the-badge&logo=intellij-idea&logoColor=white) | ![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white) |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|

# NationStates.js | API Wrapper
### Version: 0.4.4 | [📖 Documentation](https://heaveria-ns.github.io/nationstates.js/)

NationsStates.js is a **wrapper** to ease accessing the NationStates API through **method-chaining** and other abstractions. 
Additional **built-in methods for common tasks** are also included.

This wrapper takes care of enforcing the rate limit, conversions to JS objects, and allowing usage of async/await.

| ㅤ   | Feature                           | Note                                                                                                                                                                                                            |
|-----|-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ✅   | Rate limit                        | Built-in to 650ms. Can be raised, but **not** lowered.                                                                                                                                                          |
| ✅   | Dumps                             | Support for easily downloading, unzipping, and converting to JSON. See [NSMethods](#nsmethods) and the [documentation](https://heaveria-ns.github.io/nationstates.js/classes/NSMethods.html#downloadDumpAsync). |
| ✅   | Nations API                       | See [RequestBuilder](#requestbuilder).                                                                                                                                                                          |
| ✅   | Regions API                       | See [RequestBuilder](#requestbuilder).                                                                                                                                                                          |
| ✅   | World API                         | See [RequestBuilder](#requestbuilder).                                                                                                                                                                          |
| ✅   | World Assembly API                | See [RequestBuilder](#requestbuilder).                                                                                                                                                                          |
| ❌   | Telegrams                         | Future support planned.                                                                                                                                                                                         |
| 🟡  | Trading Cards API                 | See [RequestBuilder](#requestbuilder). Requires use of [addCustomParam](https://heaveria-ns.github.io/nationstates.js/classes/RequestBuilder.html#addCustomParam).                                              |
| ✅   | Verification API                  | Built-in functions to simplify process. No support for site-specific tokens. Use [NSMethods](#nsmethods) (recommended) or  [RequestBuilder](#requestbuilder).                                                   |
| ✅   | Private shards                    | See [PrivateRequestBuilder](#privaterequestbuilder).                                                                                                                                                            |
| 🟡  | Private commands                  | See [Dispatches](#dispatches). No support for `issues` or `giftcards`.                                                                                                                                          |
| ✅   | Built-in methods for common tasks | See [NSMethods](#nsmethods).                                                                                                                                                                                    |
| 🟡  | Browser support                   | [Yes](#browser support), but not guaranteed.                                                                                                                                                                    |

## Installation / Setup
### 1. Installation
While in your projects' directory run the following command in the terminal to install the library:
```
npm i nationstates.js
```

### 2. Import/Require the library
```TypeScript
// For TypeScript, you should use the following import statement (Recommended):
import * as ns from 'nationstates.js/API';

// For standard JavaScript:
const ns = require('nationstates.js');
```

### 3. Initialize
```TypeScript
/**
 * 1. Instantiate a API object.
 * TODO: Ensure to replace the user-agent. This is usually the name of your own nation.
 *       This allows NationStates servers to recognize you.
 */
const api = new ns.API('user-Agent');
```

## RequestBuilder
➡ [Documentation](https://heaveria-ns.github.io/nationstates.js/classes/RequestBuilder.html)  
➡ For private shards use [PrivateRequestBuilder](#privaterequestbuilder).
### Usage Example:
In this example, we will get Testlandia's flag and population as a JS object.
#### 1. Instantiate Object
```TypeScript
const req1 = new ns.RequestBuilder(api);
```

#### 2. Build and send the request.
```TypeScript
/**
 * HTTPS requests are asychronous in nature so we must wrap the request
 * in an async function in order to "await" the response.
 */
async function doStuff() {
    /**
     * Since we are getting Testlandia's flag and population we must:
     * Add the nation and shards to the request.
     */
    await req1.addNation('testlandia')
              .addShards(['flag', 'population'])
              // Now the request has been built to our specifications, we can send it.
              .sendRequestAsync();
    
    // Await the conversion and then log the javascript object.
    console.log((await req1.convertToJSAsync()).js);
}

// Don't forget to call the async function.
doStuff();
```
### 3. See the result!
You are responsible for traversing the result. This is approximately what the raw response will look like:
```JSON
{
  "id": "testlandia",
  "population": 39561,
  "flag": "https://www.nationstates.net/images/flags/Iran.svg"
}
```
```TypeScript
// Get full JS Object response.
console.log(req1.js) // See above
// Traverse the response. Dot notation also works.
console.log(req1.js['flag']); // https://www.nationstates.net/images/flags/Iran.svg
console.log(req1.js['population']); // 39561
```

## PrivateRequestBuilder
➡ [Documentation](https://heaveria-ns.github.io/nationstates.js/classes/PrivateRequestBuilder.html)

### Instructions
This class extends the [RequestBuilder](#requestbuilder) and functions the same.  
But in order to send any request, you must **first authenticate()** 
in order to get the x-pin and allow for quick repeated requests:

```TypeScript
const privReq = new ns.PrivateRequestBuilder(api);
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
| `downloadDumpAsync(type, directory, options?)` | Download data dumps. For options, see [IDumpOptions](https://heaveria-ns.github.io/nationstates.js/interfaces/DumpOptions.html).                                    |
| `isEndorsing(nation1, nation2)`                | Verifies if `nation1` is endorsing `nation2`. Returns a boolean.                                                                                                   |

### Usage Example:
```TypeScript
const nsFun = new ns.NSMethods(api);

let endoResult = await nsFun.isEndorsing('Testlandia', 'Olvaria'); // Is Testlandia endorsing Olvaria?

console.log(endoResult) // 0
```

## Private Commands
➡ [Dispatch Documentation](https://heaveria-ns.github.io/nationstates.js/classes/Dispatch.html)
### Dispatches
An easy way to interact with the NationStates Private Commands and add, remove, or edit dispatches in a highl-level way.
Enumerators have also been provided for `mode`, `category`, `subcategory` for ease of use.
Here are some examples:
#### 1. Adding a dispatch
```TypeScript
await new ns.Dispatch(api, 'nation', 'password', ns.Mode.add) 
    .title('Cool Title!')
    .text('Hello World!')
    .category(ns.Category.factbook)
    .subcategory(ns.Factbook.legislation)
    .executeAsync();
```

#### 2. Removing a dispatch
```TypeScript
await new ns.Dispatch(api, 'nation', 'password', ns.Mode.remove)
    .dispatchID(12345)
    .executeAsync();
```

#### 3. Editing a dispatch
```TypeScript
await new ns.Dispatch(api, 'nation', 'password', ns.Mode.edit)
    .dispatchID(1630710)
    .title('Edited Title')
    .text('Hello World!')
    .category(ns.Category.bulletin)
    .subcategory(ns.Bulletin.news)
    .executeAsync();
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
    const api = ns.API('user-agent');
    // Rest of your script here...
</script>
```

## Contact / Questions
If you've encountered any issue, have feature requests, or need support using this API please feel free to reach
out to me at anytime! Preferably on Discord at Heaveria#6413. Otherwise, send me a telegram.

Cheers,  
[Heaveria](https://www.nationstates.net/nation=heaveria)  👋🏻

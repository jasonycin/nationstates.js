


[![CodeQL](https://github.com/heaveria-ns/nationstates.js/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/heaveria-ns/nationstates.js/actions/workflows/codeql-analysis.yml)  | ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) | ![IntelliJ IDEA](https://img.shields.io/badge/IntelliJIDEA-000000.svg?style=for-the-badge&logo=intellij-idea&logoColor=white) | ![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)
--- | --- | --- | ---

# Nationstates.js | API Wrapper
### NOT RECOMMENDED FOR USE. UNDER DEVELOPMENT.
❌ Use at your own risk.

Nationstates.js is a **wrapper** to ease accessing the NationStates API through **method-chaining** and other abstractions. 
Additional **built-in functions for common tasks** are also included.

This wrapper takes care of enforcing the rate limit, conversions to JS objects, and allowing usage of async/await.

ㅤ   | Feature | Note
----|---------|--------
 ✅ | Rate limit | Built-in to 650ms. Cannot be lowered.
 ✅ | Dumps | Support for easily downloading, unzipping, and converting to JSON.
 ✅ | Nations | 
 ✅ | Regions
 ✅ | World
 ❌ | World Assembly | Missing support for adding resolution ID. Will be implemented before official release.
 ❌ | Telegrams | Future support planned.
 ✅ | Trading Cards | 
 ✅ | Verification | Built-in functions to simplify process. No support for site-specific tokens.
 ❌ | Private shards / commands | Future support planned in first major release.

Built-in features of the NSFunction class.



## Installation / Setup
### 1. Installation
While in your projects' directory run the following command in the terminal to install the libary:
```
npm i nationstates.js
```

### 2. Import/Require the library
```TypeScript
// For TypeScript, you should use the following import statement:
import { API, RequestBuilder } from 'nationstates.js';

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
const api = new API('user-Agent');
```

## RequestBuilder
➡ [Documentation](https://heaveria-ns.github.io/nationstates.js/classes/RequestBuilder.html)
### Usage Example:
In this example, we will get Testlandia's flag and population as a JS object.
#### 1. Instantiate Object
```TypeScript
const req1 = new RequestBuilder(api);
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
    console.log((await req1.convertToJsonAsync()).json);
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
// Get raw response.
console.log(req1.json) // See above
// Traverse the response. Dot notation also works.
console.log(req1.json['flag']); // https://www.nationstates.net/images/flags/Iran.svg
console.log(req1.json['population']); // 39561
```

## NSFunctions
➡ [Documentation](https://heaveria-ns.github.io/nationstates.js/classes/NSFunctions.html)

Feature | Purpose
-------|--------
`verify(checksum)` | [Verify](https://www.nationstates.net/pages/api.html#verification) the checksum of a nation using. Returns a 0 or 1.
`downloadDumpAsync(type, directory, options{})` | Download data dumps. For options, see [DumpOptions](https://heaveria-ns.github.io/nationstates.js/interfaces/dumpOptions.html).
`isEndorsing(nation1, nation2)` | Verifies if `nation1` is endorsing `nation2`. Returns a boolean.

### Usage Example:
```TypeScript
const nsfun = new NSFunctions(api);

let endoResult = await nsfun.isEndorsing('Testlandia', 'Olvaria');

console.log(endoResult) // false
```


## Contact / Questions
If you've encountered any issue, have feature requests, or need support using this API please feel free to reach
out to me at anytime! Preferably on Discord at Heaveria#6413. Otherwise, send me a telegram.

Cheers,  
[Heaveria](https://www.nationstates.net/nation=heaveria)  👋🏻

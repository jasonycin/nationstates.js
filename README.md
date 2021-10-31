[![CodeQL](https://github.com/heaveria-ns/nationstates.js/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/heaveria-ns/nationstates.js/actions/workflows/codeql-analysis.yml)
# NOT RECOMMENDED FOR USE. UNDER DEVELOPMENT.
❌ Use at your own risk.


## Usage / Example:
In this example, we will receive Testlandia's flag and population as a javascript object.
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

/**
 * 2. Instate a NSRequst object.
 */
const req1 = new RequestBuilder(api);
```

### 4. Build and send the request.
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

### 5. Done! See your result.
You are responsible for traversing the result. The outcome of the above would be:
```TypeScript
{
  id: "testlandia",
  population: 39561,
  flag: 'https://www.nationstates.net/images/flags/Iran.svg'
}
```

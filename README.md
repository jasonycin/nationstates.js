# NOT RECOMMENDED FOR USE. UNDER DEVELOPMENT.
❌ Use at your own risk.


Example:
```TypeScript
import { API, NSRequest } from 'NationStates.js'

// Parameter is your user agent.
const api = new API('Heaveria');

// Each request is its own object that must be instantiated.
const req1 = new NSRequest(api);

// Send request synchronosly.
doStuff();
async function doStuff() {
    /** 
     *  1. Add global parameter.
     *  2. Add shards.
     *  3. Send request (async).
     */
    await req1.addNation('testlandia')
              .addShards(['shard1', 'shard2'])
              .sendRequestAsync();
              
    console.log(req1.getRawResponse());
}
```
The output of the above code would be:
```XML
<NATION id="testlandia">
<POPULATION>39555</POPULATION>
<FLAG>https://www.nationstates.net/images/flags/Iran.svg</FLAG>
</NATION>
```

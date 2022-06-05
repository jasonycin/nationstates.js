/**
 * TypeScript Example -- RequestBuilder
 */

import { Client, NationPublic, RequestBuilder } from "../../API";

// Instantiate one API object to ensure rate limit and user agent is set correctly.
const client = new Client('user-agent');

examples();

/* ---- Examples ---- */
async function examples() {
    /**
     * 1. Retrieve name, gdp, and notables from Testlandia
     * 2. Build request (add nation & shards)
     * 3. Await request
     * 4. Convert request to JS object.
     * 5. Log results.
     */

    // Build request
    const request = new RequestBuilder(client)
        .addNation('testlandia')
        .addShards([NationPublic.name, NationPublic.gdp, NationPublic.notables])

    // Await request
    await request.sendRequestAsync();

    // Convert request to JS object (use request.body to get original XML response body)
    await request.convertToJSAsync();

    // Log results
    console.log(request.js['name'], request.js['gdp'], request.js['notables']['notable']);
}


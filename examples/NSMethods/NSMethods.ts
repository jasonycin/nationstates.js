/**
 * TypeScript Example -- NSMethods
 */

import {API, NationPrivate, NSMethods, PrivateRequestBuilder} from "../../API";

// Instantiate one API object to ensure rate limit and user agent is set correctly.
const api = new API('user-agent');

examples();

/* ---- Examples ---- */
async function examples() {
    /**
     * Example 1: Verify a nation using the verification API.
     * verify(nation1, nation2)
     */
    const verifyNation = await new NSMethods(api).verify('testlandia', 'KL5JiTq5iMnd3i8NgNloAmPcOEZwCwQ0ogRcIA_dC_s')

    console.log(verifyNation); // 0 or 1

    /**
     * Example 2: Verify a nation using the verification API. This time, we will add generate and add a site-specific token.
     * verify(nation1, nation2, siteSpecificToken?)
     */
    const randomToken = Math.random().toString(36).slice(2) // Use your own preferred method.

    const verifyNationWithToken = await new NSMethods(api).verify(
        'testlandia',
        'KL5JiTq5iMnd3i8NgNloAmPcOEZwCwQ0ogRcIA_dC_s',
        randomToken)

    console.log(verifyNationWithToken); // 0 or 1

    /**
     * Example 3: Check if a nation is endorsing another nation.
     * isEndorsing(nation1, nation2)
     */
    const isEndorsing = await new NSMethods(api).isEndorsing('endorser', 'endorsee')

    console.log(isEndorsing); // false or true

    /**
     * Example 4: Download a data dump in its compressed .xml.gz format.
     * downloadDumpAsync(type, pathToSave, options?)
     */
    //await new NSMethods(api).downloadDumpAsync('nations', './') // Type = 'nations' or 'regions'

    /**
     * Example 4: Download a data dump. Additionally:
     * 1. Extract the xml.gz file to a .xml file.
     * 2. Parse the .xml file to a JSON file.
     * 3. Delete the original .xml.gz file.
     * 4. Delete the original .xml file.
     * downloadDumpAsync(type, pathToSave, options?)
     */
    await new NSMethods(api).downloadDumpAsync(
        'nations', // Type = 'nations' or 'regions'
        './', // directoryToSave
        {
            extract: true, // xml.gz => xml
            convertToJson: true, // xml => json
            deleteXMLGz: true, // deletes xml.gz
            deleteXML: true // deletes xml
        }
    )
}


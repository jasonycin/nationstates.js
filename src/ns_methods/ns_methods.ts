import {API, Client} from "../client";
import {RequestBuilder} from "../request_builder/request_builder";
import * as fs from "fs";
import * as zlib from "zlib";
// Node-fetch v.2.6.5. Still supported by developers.
import fetch from 'node-fetch';

/**
 * Defines the options for downloading dumps and what to do with them.
 */
export interface IDumpOptions {
    extract?: boolean;
    deleteXMLGz?: boolean;
    deleteXML?: boolean;
    convertToJson?: boolean;
}

/**
 * As opposed to building requests manually, this class has built-in methods for easily accessing and handling
 * common information one looks for. You do not build, send, or parse requests manually.
 * @example const methods = new NSMethods(api);
 * @param { API } API The API object to enforce rate limiting and user agents.
 */
export class NSMethods extends RequestBuilder {
    constructor(api: API | Client) {
        super(api);
    }

    /**
     * Returns a boolean response, if nation1 is endorsing nation2.
     * Does not modify the URL of the request.
     * @example console.log(await methods.isEndorsing('Testlandia', 'Testlandia')); // false
     * @param nation1 - The endorser.
     * @param nation2 - The endorsee.
     */
    async isEndorsing(nation1: string, nation2: string): Promise<boolean> {
        // Reset the object's URL.
        this.resetURL();

        // Get endorsements of nation2.
        const r = await (await this
            .addNation(nation2.replace(/ /g, '_'))
            .addShards('endorsements')
            .sendRequestAsync())
            .convertToJSAsync();

        // Uses RegExp to verify if nation1 is in commma-seperated list of endorsements and returns the boolean.
        return new RegExp('(?:^|,)' + nation1.replace(/ /g, '_') + '(?:,|$)').test(r.js['endorsements'])
    }

    /**
     * Use the NS Verification API to verify the validity of a verification code.
     * Returns either a 0 or 1 as a number, as described in the NS API documentation.
     * @example console.log(await methods.verify('Testlandia', '12345')); // 0
     * @param nation
     * @param checksum
     * @param siteSpecificToken
     */
    public async verify(nation: string, checksum: string, siteSpecificToken?: string): Promise<number> {
        // Reset the object's URL.
        this.resetURL();

        // Add nation
        this.addNation(nation.toLowerCase().replace(/ /g, '_'));

        // Adds "a=verify" to the URL parameters.
        this._urlObj.searchParams.append('a', 'verify');
        // Adds checksum
        this._urlObj.searchParams.append('checksum', checksum);
        // Adds site specific token if it is set.
        if (siteSpecificToken) {
            this._urlObj.searchParams.append('token', siteSpecificToken);
        }

        // Get response
        await this.sendRequestAsync();

        // Return response as number.
        return parseInt(this._response.body);
    }


    /**
     * Download the nation data dump from the API.
     * Note that it can take a while to download the dump, especially for nations or when converting to JSON.
     * Future feature: Decode utf-8 within the dump.
     * @example methods.downloadDump('Testlandia', {extract: true, deleteXMLGz: true, deleteXML: true, convertToJson: true}); // Returns just a .json file
     * @param type -  Either 'nation' or 'region'
     * @param directoryToSave - The directory to save the dump to. Should be ended by a slash. Ex: "./downloads/"
     * @param options - If left blank, just downloads the {type}.xml.gz file.
     */
    public async downloadDumpAsync(type: string, directoryToSave: string, options?: IDumpOptions): Promise<NSMethods> {
        // TODO: Implement decoding utf-8 within the dump.
        // Verify if type is correct
        if (type !== 'nations' && type !== 'regions') throw new Error('Type must be either "nation" or "region"');

        // Get current date as YYYY-MM-DD
        const currentDate = new Date().toISOString().slice(0, 10);

        // Set fileName with directory
        const fileName = directoryToSave + type + '.' + currentDate;

        // If the dump is already present, do not download it.
        if (!fs.existsSync(fileName + '.xml.gz')) {
            // Check rate limit.
            await this.execRateLimit();

            // Request the file from the NationStates API.
            const res = await fetch(`https://www.nationstates.net/pages/${type}.xml.gz`, {
                headers: {
                    'User-Agent': this.API.userAgent
                }
            });

            // Create a file stream to save the file.
            const fileStream = fs.createWriteStream(fileName + '.xml.gz');
            // Synchronously write the file to the file stream.
            await new Promise((resolve, reject) => {
                res.body.pipe(fileStream);
                res.body.on("error", reject);
                fileStream.on("finish", resolve);
            });
        }

        if (options?.extract) await this.gunzip(fileName + '.xml.gz', fileName + '.xml');

        if (options?.convertToJson) {
            // Verify the XML file has been unzipped. If not, do so.
            if (!fs.existsSync(fileName + '.xml')) await this.gunzip(fileName + '.xml.gz', fileName + '.xml');

            // Convert the XML file to JSON.
            await this.xmlToJson(fileName + '.xml', fileName + '.json');
        }

        if (options?.deleteXMLGz) fs.unlinkSync(fileName + '.xml.gz');

        if (options?.deleteXML) fs.unlinkSync(fileName + '.xml');

        // Method chaining
        return this;
    }

    /**
     * Extracts a gzipped file.
     * @param file
     * @param savePath
     * @private
     */
    private async gunzip(file: string, savePath: string): Promise<NSMethods> {
        // Decompress the gzip file.
        await new Promise((resolve) => {
            zlib.gunzip(fs.readFileSync(file), (err, buffer) => {
                fs.writeFileSync(savePath, buffer);
                resolve('Finished unzipping.');
            })
        });

        // Method chaining
        return this;
    }

    /**
     * Converts an XML file to JSON and saves it to the specified path.
     * Uses the XML2Js library.
     * @param file
     * @param savePath
     * @private
     */
    private async xmlToJson(file: string, savePath: string) {
        // Convert the XML file to JSON.
        let xml = fs.readFileSync(file, 'utf8');

        // Create JSON file
        const json = fs.createWriteStream(savePath);
        // Write JSON to file
        json.write(JSON.stringify(await this.parseXml(xml)));

        // Method Chaining
        return this;
    }
}

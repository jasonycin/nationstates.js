import {Client} from "../client";
import {RequestBuilder} from "../request_builder/request_builder";
import {RegionPublic} from "../enums/region_public";
import {RegionResult} from "./region_result";

export class Region {
    public request;

    constructor(private _client: Client, region: string) {
        this.request = new RequestBuilder(_client)
            .addRegion(region)
            .addShards(Object.values(RegionPublic));
    }

    public async init(): Promise<RegionResult> {
        await this.request.sendRequestAsync();
        await this.request.convertToJSAsync();
        return new RegionResult(this.request.js);
    }
}

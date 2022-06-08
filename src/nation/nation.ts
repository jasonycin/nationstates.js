import {Client} from "../client";
import {RequestBuilder} from "../request_builder/request_builder";
import {NationResult} from "./nation_result";
import {RegionPublic} from "../enums/region_public";
import {NationPublic} from "../enums/nation_public";

export class Nation {
    public request;

    constructor(private _client: Client, nation: string) {
        this.request = new RequestBuilder(_client).addNation(nation)
                                                  .addShards(Object.values(NationPublic));
    }

    public async init(): Promise<NationResult> {
        await this.request.execute();
        await this.request.toJS();
        console.log(this.request.js);
        return new NationResult(this.request.js);
    }
}

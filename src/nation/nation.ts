import {Client} from "../client";
import {RequestBuilder} from "../request_builder/request_builder";
import {NationPublic} from "../enums/nation_public";
import {NationResult} from "./nation_result";

export class Nation {
    public request;

    constructor(private _client: Client, nation: string) {
        this.request = new RequestBuilder(_client)
            .addNation(nation)
            .addShards(Object.values(NationPublic));
    }

    public async init(): Promise<NationResult> {
        await this.request.sendRequestAsync();
        await this.request.convertToJSAsync();
        return new NationResult(this.request.js);
    }
}

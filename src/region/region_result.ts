interface Happening {
    timestamp: number,
    text: string
}

export class RegionResult {
    public id: string;
    public name: string;
    public dbid: number;
    public lastUpdate: number;
    public factbook: string;
    public dispatches: Array<number>;
    public numnations: number;
    public nations: Array<string>;
    public delegate: string;
    public delegateAuth: string;
    public officers: {
        nation: string,
        office: string,
        authority: string,
        time: number,
        by: string,
        order: number
    }[];
    public delegateVotes: number;
    public gaVote: { for: number, against: number };
    public scVote: { for: number, against: number };
    public founder: string;
    public founderAuth: string;
    public founded: string;
    public foundedTime: number;
    public power: string;
    public flag: URL;
    public embassies: {
        built: Array<string>,
        requests: { value: string, type: string }[]
    };
    public embassyRMB: string;
    public waBadges: string;
    public tags: Array<string>;
    public messages: {
        id: number,
        timestamp: number,
        nation: string,
        status: number,
        likes: number,
        likers?: Array<string>,
        message: string,
    }[];
    public happenings: Happening[];
    public history: {
        timestamp: number,
        text: string
    }[];
    public census: {
        scale: { id: number, score: number, rank: number }
    };
    public censusRanks: {
        id: number,
        nations: {
            name: string,
            rank: string,
            score: number
        }
    };
    public zombie: { survivors: number, zombies: number, dead: number };

    constructor(result: object) {
        this.id = result['id'];
        this.name = result['name'];
        this.dbid = <number>result['dbid'];
        this.lastUpdate = <number>result['lastupdate'];
        this.factbook = decodeURIComponent(result['factbook']);
        this.dispatches = <Array<number>>result['dispatches'].split(',');
        this.numnations = <number>result['numnations'];
        this.nations = <Array<string>>result['nations'].split(':');
        this.delegate = result['delegate'];
        this.delegateAuth = result['delegateauth'];
        this.officers = result['officers']['officer'];
        this.delegateVotes = <number>result['delegatevotes'];
        this.gaVote = {
            for: <number>result['gavote']['for'],
            against: <number>result['gavote']['against']
        };
        this.scVote = {
            for: <number>result['scvote']['for'],
            against: <number>result['scvote']['against']
        };
        this.founder = result['founder'];
        this.founderAuth = result['founderauth'];
        this.founded = result['founded'];
        this.foundedTime = <number>result['foundedtime'];
        this.power = result['power'];
        this.flag = new URL(result['flag']);
        this.embassies = {
            built: [],
            requests: []
        };
        this._setEmbassies(result['embassies']['embassy']);
        this.embassyRMB = result['embassyrmb'];
        this.waBadges = result['wabadges'];
        this.tags = result['tags']['tag'];
        this.messages = result['messages']['post'].map(message => {
            return {
                id: <number>message['id'],
                timestamp: <number>message['timestamp'],
                nation: message['nation'],
                status: <number>message['status'],
                likes: <number>message['likes'],
                likers: message['likers'] ? message['likers'].split(':') : [],
                message: message['message']
            };
        });
        this.happenings = result['happenings']['event'];
        this.history = result['history']['event'];
        this.census = result['census'];
        this.censusRanks = result['censusranks'];
        this.zombie = result['zombie'];
    }

    private _setEmbassies(embassies) {
        embassies.forEach(embassy => {
            if (typeof embassy === 'string') {
                this.embassies.built.push(embassy);
            } else if (typeof embassy === 'object') {
                this.embassies.requests.push({
                    value: embassy['value'],
                    type: embassy['type']
                });
            }
        });
    }

    /**
     * Maps and returns all happenings after converting timestamps to a properly set Date object in UTC
     * and fixing the format of the text by removing all @ symbols.
     */
    public formattedHappenings(): {timestamp: Date, text: string}[] {
        return this.happenings.map(happening => {
            return {
                timestamp: RegionResult._epochToDate(happening.timestamp),
                text: happening.text.replaceAll('@@', '')
            };
        });
    }

    private static _epochToDate(epoch: number): Date {
        const date = new Date(0);
        date.setUTCSeconds(epoch);
        return date;
    }


}

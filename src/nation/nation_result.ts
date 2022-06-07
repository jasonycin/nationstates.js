interface Freedom {
    civilrights: string,
    economy: string,
    politicalfreedom: string;
}

interface Govt {
    administration: number,
    defence: number,
    education: number,
    environment: number,
    healthcare: number,
    commerce: number,
    internationalAid: number,
    lawAndOrder: number,
    publicTransport: number,
    socialEquality: number,
    spirituality: number,
    welfare: number;
}

interface Sectors {
    blackmarket: number,
    government: number,
    industry: number,
    public: number;
}

interface Deaths {
    cause: { value: number, type: string }[]
}

interface Policies {
     policy: {
         name: string,
         pic: string,
         cat: string,
         desc: string
     }[]
}

interface DispatchList {
      id: number,
      title: string, // DECODE
      author: string,
      category: string,
      subcategory: string,
      created: number,
      edited: number,
      views: number,
      score: number
}

interface Happening {
    timestamp: number,
    text: string
}

interface Zombie {
    zaction: string,
    zactionintended: string,
    survivors: number,
    zombies: number,
    dead: number
}


export class NationResult {
    public id: string;
    public name: string;
    public dbid: number;
    public type: string;
    public fullname: string;
    public motto: string;
    public category: string;
    public unstatus: string;
    public endorsements: Array<string>;
    public gavote: string;
    public scvote: string;
    public issuesAnswered: number;
    public freedom: Freedom = {
        civilrights: null,
        economy: null,
        politicalfreedom: null
    };
    public region: string;
    public population: number;
    public tax: number;
    public animal: string;
    public animaltrait: string;
    public currency: string;
    public flag: URL;
    public banner: string;
    public banners: {
        banner: Array<string>;
    };
    public demonym: string;
    public demonym2plural: string;
    public gdp: number;
    public income: number;
    public richest: number;
    public poorest: number;
    public majorindustry: string;
    public crime: string;
    public govtPriority: string;
    public govt: Govt = {
        administration: null,
        defence: null,
        education: null,
        environment: null,
        healthcare: null,
        commerce: null,
        internationalAid: null,
        lawAndOrder: null,
        publicTransport: null,
        socialEquality: null,
        spirituality: null,
        welfare: null
    };
    public sectors: Sectors = {
        blackmarket: null,
        government: null,
        industry: null,
        public: null
    }
    public govtdesc: string;
    public industrydesc: string;
    public notable: string;
    public notables: {
        notable: Array<string>;
    }
    public admirable: string;
    public admirables: {
        admirable: Array<string>;
    };
    public founded;
    public foundedTime: number;
    public firstLogin: number;
    public lastLogin: number;
    public lastActivity: string;
    public influence: string;
    public publicSector: string;
    public deaths: Deaths;
    public leader: Array<string>;
    public capital: Array<string>;
    public religion: Array<string>;
    public policies: Policies;
    public census: {
        scale: {
            id: number,
            score: number,
            rank: number,
            rrank: number
        }
    };
    public rcensus: { value: number, id: number };
    public wcensus: { value: number, id: number };
    public legislation: { law: Array<string> };
    public happenings: Happening[];
    public factbooks: number;
    public dispatches: number;
    public factbookList: DispatchList[];
    public dispatchList: DispatchList[];
    public waBadges: string;
    public tgcanrecruit: number;
    public tgcancampaign: number;
    public zombie: Zombie;

    constructor(result: object) {
        this.id = result['id'];
        this.name = result['name'];
        this.dbid = <number>result['dbid'];
        this.fullname = result['fullname'];
        this.motto = result['motto'];
        this.category = result['category'];
        this.unstatus = result['unstatus'];
        this.endorsements = result['endorsements'].split(',');
        this.gavote = result['gavote'];
        this.scvote = result['scvote'];
        this.issuesAnswered = <number>result['issues_answered'];
        this.freedom.civilrights = result['freedom']['civilrights'];
        this.freedom.economy = result['freedom']['economy'];
        this.freedom.politicalfreedom = result['freedom']['politicalfreedom'];
        this.region = result['region'];
        this.population = <number>result['population'];
        this.tax = <number>result['tax'];
        this.animal = result['animal'];
        this.animaltrait = result['animaltrait'];
        this.currency = result['currency'];
        this.flag = new URL(result['flag']);
        this.banner = result['banner'];
        this.banners = result['banners']['banner'];
        this.demonym = result['demonym'];
        this.demonym2plural = result['demonym2plural'];
        this.gdp = <number>result['gdp'];
        this.income = <number>result['income'];
        this.richest = <number>result['richest'];
        this.poorest = <number>result['poorest'];
        this.majorindustry = result['majorindustry'];
        this.crime = result['crime'];
        this.govtPriority = result['govtpriority'];
        this.govt.administration = <number>result['govt']['administration'];
        this.govt.defence = <number>result['govt']['defence'];
        this.govt.education = <number>result['govt']['education'];
        this.govt.environment = <number>result['govt']['environment'];
        this.govt.healthcare = <number>result['govt']['healthcare'];
        this.govt.commerce = <number>result['govt']['commerce'];
        this.govt.internationalAid = <number>result['govt']['internationalaid'];
        this.govt.lawAndOrder = <number>result['govt']['lawandorder'];
        this.govt.publicTransport = <number>result['govt']['publictransport'];
        this.govt.socialEquality = <number>result['govt']['socialequality'];
        this.govt.spirituality = <number>result['govt']['spirituality'];
        this.govt.welfare = <number>result['govt']['welfare'];
        this.sectors.blackmarket = <number>result['sectors']['blackmarket'];
        this.sectors.government = <number>result['sectors']['government'];
        this.sectors.industry = <number>result['sectors']['industry'];
        this.sectors.public = <number>result['sectors']['public'];
        this.govtdesc = result['govtdesc'];
        this.industrydesc = result['industrydesc'];
        this.notable = result['notable'];
        this.notables = result['notables']['notable'];
        this.admirable = result['admirable'];
        this.admirables = result['admirables']['admirable'];
        this.founded = result['founded'];
        this.foundedTime = <number>result['foundedtime'];
        this.firstLogin = <number>result['firstlogin'];
        this.lastLogin = <number>result['lastlogin'];
        this.lastActivity = result['lastactivity'];
        this.influence = result['influence'];
        this.publicSector = result['publicsector'];
        this.deaths = result['deaths'];
        this.leader = result['leader'];
        this.capital = result['capital'];
        this.religion = result['religion'];
        this.policies = result['policies'];
        this.census = result['census'];
        this.rcensus = result['rcensus'];
        this.wcensus = result['wcensus'];
        this.legislation = result['legislation'];
        this.happenings = result['happenings'];
        this.factbooks = <number>result['factbooks'];
        this.dispatches = <number>result['dispatches'];
        this.factbookList = result['factbooklist']['factbook'];
        this.dispatchList = result['dispatchlist']['dispatch'];
        this.waBadges = result['waBadges'];
        this.tgcanrecruit = <number>result['tgcanrecruit'];
        this.tgcancampaign = <number>result['tgcancampaign'];
        this.happenings = result['happenings']['event'];
        this.zombie = result['zombie'];
    }

    /**
     * Maps and returns all happenings after converting timestamps to a properly set Date object in UTC
     * and fixing the format of the text by removing all @ symbols.
     */
    public formattedHappenings(): {timestamp: Date, text: string}[] {
        return this.happenings.map(happening => {
            return {
                timestamp: NationResult._epochToDate(happening.timestamp),
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

import * as ns from './API';

const api = new ns.API('Heaveria');


main()
async function main() {
    const nsMeth = new ns.NSMethods(api)
    //await nsMeth.downloadDumpAsync('regions', './', { convertToJson: true })



    console.log(await nsMeth.verify('nation', 'D4CS6y60kwy7YzzpN8Hc3TkMdZBZ4ZP_b1J_DwPkmUk'))
}

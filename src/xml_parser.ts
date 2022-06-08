import * as xml2js from 'xml2js';

/**
 * @author The xmlParser is based on the following written by Auralia:
 * https://github.com/auralia/node-nsapi/blob/master/src/api.ts#L25
 * @hidden
 */
const xmlParser = new xml2js.Parser({
    charkey: "value",
    trim: true,
    normalizeTags: true,
    normalize: true,
    explicitRoot: false,
    explicitArray: false,
    mergeAttrs: true,
    attrValueProcessors: [(value: any) => {
        let num = Number(value);
        if (!isNaN(num)) {
            return num;
        } else {
            return value;
        }
    }],
    valueProcessors: [(value: any) => {
        let num = Number(value);
        if (!isNaN(num)) {
            return num;
        } else {
            return value;
        }
    }]
});

/**
 * Parses XML into a JSON object.
 * @author The xmLParser is based on the following written by Auralia:
 * https://github.com/auralia/node-nsapi/blob/master/src/api.ts#L25
 * @param {string} xml The XML to parse.
 * @return data promise returning a JSON object.
 */
export function parseXml(xml: string): Promise<object> {
    return new Promise((resolve, reject) => {
        xmlParser.parseString(xml, (err: any, data: any) => {
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    });
}

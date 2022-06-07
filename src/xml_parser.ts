import * as xml2js from 'xml2js';

/**
 * @author The xmlParser is based on the following written by Auralia:
 * https://github.com/auralia/node-nsapi/blob/master/src/api.ts#L25
 * @hidden
 */
export const xmlParser = new xml2js.Parser({
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

import { Parser } from 'csv-parse';
import * as fs from 'fs';
import { Lap } from 'lap';
import moment = require('moment');

export async function parseCsv(inputFile: string): Promise<Lap[]> {
    const parser = new Parser({
        cast: (value, context) => {
            if (context.index === 0) {
                return moment.duration(value);
            } else {
                return Number(value);
            }
        },
        delimiter: ',',
        trim: true,
    });

    const laps: Lap[] = [];
    const readStream = fs.createReadStream(inputFile);

    parser.on('readable', () => {
        let record: any[] = [];
        const read = () => record = parser.read();
        while (null !== read()) {
            laps.push({
                heartRate: record[1],
                time: record[0],
            });
        }
    });
    readStream.pipe(parser);

    return new Promise((done, error) => {
        parser.on('error', (err) => error(err));
        parser.on('end', () => {
            done(laps);
        });
    });
}

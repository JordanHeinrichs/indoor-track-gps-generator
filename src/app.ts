import { ArgumentParser } from 'argparse';
import { Config } from 'config';
import * as fs from 'fs';
import moment = require('moment');
import { parseCsv } from './parse-csv';
import { TcxWriter } from './tcx-writer';

const parser = new ArgumentParser({
    addHelp: true,
    description: 'Use this program to generate a tcx file from a csv file',
    version: '1.0.0',
});

parser.addArgument(
    [ '-c', '--config'],
    {
        help: 'Config json file located in the config folder',
        required: true,
    },
);
parser.addArgument(
    [ '-i', '--input'],
    {
        help: 'Input csv file, formatted comma seperated',
        required: true,
    },
);
parser.addArgument(
    [ '-o', '--output'],
    {
        help: 'Output tcx file name',
        required: true,
    },
);
parser.addArgument(
    [ '-t', '--time'],
    {
        help: 'Start time',
        required: false,
    },
);

async function main(): Promise<void> {
    const args = parser.parseArgs();
    const laps = await parseCsv(args.input);
    const startTime = moment(args.time);

    const config: Config = JSON.parse(fs.readFileSync(args.config).toString());

    const tcxWriter = new TcxWriter(startTime, args.output, config);

    laps.forEach((lap) => {
        tcxWriter.writeLap(lap);
    });

    await tcxWriter.writeToFile();
}

main().catch((err) => {
    console.error('Unable to create tcx file');
    console.error(err);
});

import { ArgumentParser } from 'argparse';
import { parseCsv } from './parse-csv';

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

async function main(): Promise<void> {
    const args = parser.parseArgs();
    const laps = await parseCsv(args.input);
    console.log(laps);
}

main().catch((err) => {
    console.error('Unable to create tcx file');
    console.error(err);
});

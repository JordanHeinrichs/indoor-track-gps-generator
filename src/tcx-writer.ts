import { Config } from 'config';
import * as fs from 'fs';
import { Lap } from 'lap';
import { Moment } from 'moment';
import xmlbuilder = require('xmlbuilder');
import { CoordinateCalculator } from './coordinate-calculator';

export class TcxWriter {
    private POINTS_PER_LAP = 25;
    private xmlWriter: xmlbuilder.XMLElementOrXMLNode;
    private currentTime: Moment;
    private currentDistance = 0;
    private coordinateCalculator: CoordinateCalculator;

    constructor(private readonly startTime: Moment, private readonly output: string, private readonly config: Config) {
        this.currentTime =  this.startTime;
        this.coordinateCalculator = new CoordinateCalculator(config);

        this.xmlWriter = xmlbuilder.create('TrainingCenterDatabase');
        this.xmlWriter = this.xmlWriter.ele('Activities')
            .ele('Activity', {Sport: 'running'})
            .ele('ID', this.formatDate(startTime)).up();
    }

    public writeLap(lap: Lap): void {
        this.xmlWriter = this.xmlWriter.ele('Lap', {StartTime: this.formatDate(this.startTime)});
        this.xmlWriter = this.xmlWriter.ele('TotalTimeSeconds', lap.time.asSeconds().toString()).up();
        this.xmlWriter = this.xmlWriter.ele('DistanceMeters', this.config.trackLength.toString()).up();
        this.xmlWriter = this.xmlWriter.ele('Track');

        const percentStep = 1 / this.POINTS_PER_LAP;
        for (let percent = 0; percent < 1; percent += percentStep) {
            this.xmlWriter = this.xmlWriter.ele('Trackpoint');

            this.currentTime = this.currentTime.add(lap.time.asMilliseconds() * percentStep, 'milliseconds');
            this.currentDistance = this.currentDistance + percentStep * this.config.trackLength;
            this.xmlWriter = this.xmlWriter.ele('Time', this.formatDate(this.currentTime)).up();
            this.xmlWriter = this.xmlWriter.ele('DistanceMeters', this.currentDistance.toString()).up();

            const coordinate = this.coordinateCalculator.getCoordinateForPercent(percent);
            this.xmlWriter = this.xmlWriter.ele('Position')
                .ele('LatitudeDegrees', coordinate.latitude.toString()).up()
                .ele('LongitudeDegrees', coordinate.longitude.toString()).up()
                .up();

            if (!isNaN(lap.heartRate)) {
                this.xmlWriter = this.xmlWriter.ele('HeartRateBpm')
                    .ele('Value', lap.heartRate.toString()).up()
                    .up();
            }
            this.xmlWriter = this.xmlWriter.up();
        }

        this.xmlWriter = this.xmlWriter.up();
        this.xmlWriter = this.xmlWriter.up();
    }

    public async writeToFile(): Promise<void> {
        return new Promise((done) => {
            const writeStream = fs.createWriteStream(this.output);
            writeStream.on('close', () => done());
            writeStream.write(this.xmlWriter.end({ pretty: true }));
            writeStream.end();
        });
    }

    private formatDate(date: Moment): string {
        return date.utc().format('YYYY-MM-DDTHH:mm:ss.SSS\\Z');
    }
}

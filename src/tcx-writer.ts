import { Config } from 'config';
import * as fs from 'fs';
import { Lap } from 'lap';
import { Moment } from 'moment';
import xmlbuilder = require('xmlbuilder');
import { CoordinateCalculator } from './coordinate-calculator';

export class TcxWriter {
    private POINTS_PER_LAP = 25;
    private xmlWriter: xmlbuilder.XMLElementOrXMLNode;
    private lapStartTime: Moment;
    private lapStartDistance = 0;
    private coordinateCalculator: CoordinateCalculator;

    constructor(private readonly startTime: Moment, private readonly output: string, private readonly config: Config) {
        this.lapStartTime =  this.startTime;
        this.coordinateCalculator = new CoordinateCalculator(config);

        this.xmlWriter = xmlbuilder.create('TrainingCenterDatabase');
        this.xmlWriter = this.xmlWriter.ele('Activities')
            .ele('Activity', {Sport: 'running'})
            .ele('Id', this.formatDate(startTime)).up();
    }

    public writeLap(lap: Lap): void {
        this.xmlWriter = this.xmlWriter.ele('Lap', {StartTime: this.formatDate(this.startTime)});
        this.xmlWriter = this.xmlWriter.ele('TotalTimeSeconds', lap.time.asSeconds().toString()).up();
        this.xmlWriter = this.xmlWriter.ele('DistanceMeters', this.config.trackLength.toString()).up();
        this.xmlWriter = this.xmlWriter.ele('Track');

        let currentLapTime = this.lapStartTime.clone();
        let currentLapDistance = this.lapStartDistance;
        const percentStep = 1 / this.POINTS_PER_LAP;
        for (let percent = 0; percent < 1; percent += percentStep) {
            this.xmlWriter = this.xmlWriter.ele('Trackpoint');

            currentLapTime = currentLapTime.add(lap.time.asMilliseconds() * percentStep, 'milliseconds');
            currentLapDistance = currentLapDistance + percentStep * this.config.trackLength;
            this.xmlWriter = this.xmlWriter.ele('Time', this.formatDate(currentLapTime)).up();
            this.xmlWriter = this.xmlWriter.ele('DistanceMeters', currentLapDistance.toString()).up();

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

        this.lapStartTime = this.lapStartTime.add(lap.time);
        this.lapStartDistance += this.config.trackLength;

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

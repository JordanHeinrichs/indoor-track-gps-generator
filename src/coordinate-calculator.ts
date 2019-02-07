import { Config } from 'config';
import { Coordinate } from './coordinate';
import { Vector } from './vector';

export class CoordinateCalculator {
    private readonly sideLength: number;
    private readonly radius: number;
    private readonly offset: number;
    private readonly trackLength: number;
    private readonly firstLegPercent: number;
    private readonly secondLegPercent: number;
    private readonly thirdLegPercent: number;
    private readonly forthLegPercent: number;
    private readonly centerCoordinate: Coordinate;

    constructor(private config: Config) {
        this.sideLength = config.trackLength / (2 * Math.PI * (1 / config.ratioSideToRadius) + 2);
        this.radius =  (1 / config.ratioSideToRadius) * this.sideLength;
        this.offset = config.offset * Math.PI / 180;
        this.trackLength = config.trackLength;

        this.centerCoordinate = new Coordinate(config.centerLatitude, config.centerLongitude);

        this.firstLegPercent = this.sideLength / 2 / config.trackLength;
        this.secondLegPercent = (Math.PI * this.radius + this.sideLength / 2) / config.trackLength;
        this.thirdLegPercent = (Math.PI * this.radius + 3 * this.sideLength / 2) / config.trackLength;
        this.forthLegPercent = (2 * Math.PI * this.radius + 3 * this.sideLength / 2) / config.trackLength;
    }

    public getCoordinateForPercent(percent: number): Coordinate {
        let vectorToTrackLocation: Vector;
        if (percent < this.firstLegPercent) {
            vectorToTrackLocation = Vector.createFromPolar(this.radius, this.offset).add(
                Vector.createFromPolar(percent * this.sideLength / 2, this.offset + Math.PI / 2));
        } else if (percent < this.secondLegPercent) {
            vectorToTrackLocation = Vector.createFromPolar(this.sideLength / 2, this.offset + Math.PI / 2).add(
                Vector.createFromPolar(this.radius,
                    (percent * this.trackLength - this.sideLength / 2) / this.radius + this.offset));
        } else if (percent < this.thirdLegPercent) {
            vectorToTrackLocation = Vector.createFromPolar(this.sideLength / 2, this.offset + Math.PI / 2).add(
                Vector.createFromPolar(this.radius, Math.PI + this.offset),
            ).add(Vector.createFromPolar(percent * this.trackLength - Math.PI * this.radius - this.sideLength / 2,
                3 * Math.PI / 2 + this.offset));
        } else if (percent < this.forthLegPercent) {
            vectorToTrackLocation = Vector.createFromPolar(this.sideLength / 2, this.offset + 3 * Math.PI / 2).add(
                Vector.createFromPolar(this.radius,
                    (percent * this.trackLength - 3 / 2 * this.sideLength) / this.radius + this.offset),
            );
        } else {
            vectorToTrackLocation = Vector.createFromPolar(this.sideLength / 2, this.offset + 3 * Math.PI / 2).add(
                Vector.createFromPolar(this.radius, this.offset)).add(
                    Vector.createFromPolar(
                        percent * this.trackLength - 3 / 2 * this.sideLength - 2 * Math.PI * this.radius,
                        this.offset + Math.PI / 2),
                );

        }

        return this.centerCoordinate.add(vectorToTrackLocation.x, vectorToTrackLocation.y, this.config);
    }
}

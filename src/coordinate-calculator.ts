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
    private readonly fourthLegPercent: number;
    private readonly centerCoordinate: Coordinate;

    constructor(private config: Config) {
        if (config.ratioSideToRadius === 0) {
            this.sideLength = 0;
            this.radius = config.trackLength / (2 * Math.PI);
        } else {
            this.sideLength = config.trackLength / (2 * Math.PI * (1 / config.ratioSideToRadius) + 2);
            this.radius =  (1 / config.ratioSideToRadius) * this.sideLength;
        }
        this.offset = config.offset * Math.PI / 180;
        this.trackLength = config.trackLength;

        this.centerCoordinate = new Coordinate(config.centerLatitude, config.centerLongitude);

        this.firstLegPercent = this.sideLength / 2 / config.trackLength;
        this.secondLegPercent = (Math.PI * this.radius + this.sideLength / 2) / config.trackLength;
        this.thirdLegPercent = (Math.PI * this.radius + 3 * this.sideLength / 2) / config.trackLength;
        this.fourthLegPercent = (2 * Math.PI * this.radius + 3 * this.sideLength / 2) / config.trackLength;
    }

    public getCoordinateForPercent(percent: number): Coordinate {
        const distanceTravelled = percent * this.trackLength;

        let vectorToTrackLocation: Vector;
        if (percent < this.firstLegPercent) {
            vectorToTrackLocation = Vector.createFromPolar(this.radius, this.offset).add(
                Vector.createFromPolar(distanceTravelled, this.offset + Math.PI / 2));
        } else if (percent < this.secondLegPercent) {
            vectorToTrackLocation = Vector.createFromPolar(this.sideLength / 2, this.offset + Math.PI / 2).add(
                Vector.createFromPolar(this.radius,
                    (distanceTravelled - this.sideLength / 2) / this.radius + this.offset));
        } else if (percent < this.thirdLegPercent) {
            vectorToTrackLocation = Vector.createFromPolar(this.sideLength / 2, this.offset + Math.PI / 2).add(
                Vector.createFromPolar(this.radius, Math.PI + this.offset),
            ).add(Vector.createFromPolar(distanceTravelled - Math.PI * this.radius - this.sideLength / 2,
                3 * Math.PI / 2 + this.offset));
        } else if (percent < this.fourthLegPercent) {
            vectorToTrackLocation = Vector.createFromPolar(this.sideLength / 2, this.offset + 3 * Math.PI / 2).add(
                Vector.createFromPolar(this.radius,
                    (distanceTravelled - 3 / 2 * this.sideLength) / this.radius + this.offset),
            );
        } else {
            vectorToTrackLocation = Vector.createFromPolar(this.sideLength / 2, this.offset + 3 * Math.PI / 2).add(
                Vector.createFromPolar(this.radius, this.offset)).add(
                    Vector.createFromPolar(
                        distanceTravelled - 3 / 2 * this.sideLength - 2 * Math.PI * this.radius,
                        this.offset + Math.PI / 2),
                );
        }

        return this.centerCoordinate.add(vectorToTrackLocation.x, vectorToTrackLocation.y, this.config);
    }
}

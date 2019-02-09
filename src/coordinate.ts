import { Config } from 'config';

export class Coordinate {
    constructor(public readonly latitude: number, public readonly longitude: number) {
    }

    public add(metersEast: number, metersNorth: number, config: Config): Coordinate {
        return new Coordinate(this.latitude + this.meterToLatitude(metersNorth, config),
            this.longitude + this.metersToLongitude(metersEast, config));
    }

    private meterToLatitude(meter: number, config: Config): number {
        // formula from https://en.wikipedia.org/wiki/Geographic_coordinate_system
        const latitude = config.centerLatitude * Math.PI / 180;
        const meterToLatitudeConv =  111132.954 - 559.822 * Math.cos(2 * latitude) +
            1.175 * Math.cos(4 * latitude) - 0.0023 * Math.cos(6 * latitude);
        return meter / Math.abs(meterToLatitudeConv);
    }

    private metersToLongitude(meter: number, config: Config): number {
        // formula from https://en.wikipedia.org/wiki/Geographic_coordinate_system
        const latitude = config.centerLatitude * Math.PI / 180;
        const meterToLongitudeConv =  111412.84 * Math.cos(latitude) -
            93.5 * Math.cos(3 * latitude) +
            0.118 * Math.cos(5 * latitude);
        return meter / Math.abs(meterToLongitudeConv);
    }
}

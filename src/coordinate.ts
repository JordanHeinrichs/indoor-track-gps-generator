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
        const latitudePositive = Math.abs(config.centerLongitude);
        const meterToLatitudeConv =  111132.954 - 559.822 * Math.cos(2 * latitudePositive * Math.PI / 180) +
            1.175 * Math.cos(4 * latitudePositive) - 0.0023 * Math.cos(6 * latitudePositive  * Math.PI / 180);
        return meter / Math.abs(meterToLatitudeConv);
    }

    private metersToLongitude(meter: number, config: Config): number {
        // formula from https://en.wikipedia.org/wiki/Geographic_coordinate_system
        const longitudePositive = Math.abs(config.centerLongitude);
        const meterToLongitudeConv =  111412.84 * Math.cos(longitudePositive * Math.PI / 180) -
            93.5 * Math.cos(3 * longitudePositive * Math.PI / 180) +
            0.118 * Math.cos(5 * longitudePositive * Math.PI / 180);
        return meter / Math.abs(meterToLongitudeConv);
    }
}

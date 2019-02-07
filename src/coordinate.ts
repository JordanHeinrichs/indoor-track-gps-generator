import { Config } from 'config';

export class Coordinate {
    constructor(public readonly latitude: number, public readonly longitude: number) {
    }

    public add(metersNorth: number, metersSouth: number, config: Config): Coordinate {
        return new Coordinate(this.latitude + this.meterToLatitude(metersNorth, config),
            this.longitude + this.metersToLongitude(metersSouth, config));
    }

    private meterToLatitude(meter: number, config: Config): number {
        // formula from https://en.wikipedia.org/wiki/Geographic_coordinate_system
        const meterToLatitudeConv =  111132.954 - 559.822 * Math.cos(2 * config.centerLatitude * Math.PI / 180) +
            1.175 * Math.cos(4 * config.centerLatitude) - 0.0023 * Math.cos(6 * config.centerLatitude  * Math.PI / 180);
        return meter / meterToLatitudeConv;
    }

    private metersToLongitude(meter: number, config: Config): number {
        // formula from https://en.wikipedia.org/wiki/Geographic_coordinate_system
        const meterToLongitudeConv =  111412.84 * Math.cos(config.centerLongitude * Math.PI / 180) -
            93.5 * Math.cos(3 * config.centerLongitude * Math.PI / 180) +
            0.118 * Math.cos(5 * config.centerLongitude * Math.PI / 180);
        return meter / meterToLongitudeConv;
    }
}

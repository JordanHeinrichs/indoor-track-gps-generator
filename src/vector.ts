export class Vector {
    public static createFromPolar(magnitude: number, angle: number): Vector {
        return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
    }

    constructor(public readonly x: number, public readonly y: number) {
    }

    public add(other: Vector): Vector {
        return new Vector(this.x + other.x, this.y + other.y);
    }
}

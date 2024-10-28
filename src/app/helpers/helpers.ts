export function formatTemperature(temp: number, isMetricUnits: boolean): string {
    return `${Math.round(temp)} ${isMetricUnits ? "ºC" : "ºF"}`;
}

export function getWindDirection(degrees: number): string {

    // This array has to be clockwise to work properly
    // N -> E -> S -> W
    const DIRECTIONS: string[] = [
        'N', 'NNE', 'NE', 'ENE',
        'E', 'ESE', 'SE', 'SSE',
        'S', 'SSW', 'SW', 'WSW',
        'W', 'WNW', 'NW', 'NNW',
    ];
    const DEGREES = 360;
    const NUMBER_OF_DIRECTIONS = DIRECTIONS.length; // should always be 16
    const MIDDLE_SECTION = 45;

    const compass = ((degrees %= DEGREES) < 0 ? degrees + DEGREES : degrees);

    const direction = Math.round(compass / MIDDLE_SECTION) % NUMBER_OF_DIRECTIONS;

    return DIRECTIONS[direction];
}


export function formatVisibility(visibility: number): string {

    const visibilityInKilometers = visibility / 1000;

    return new Intl.NumberFormat("en", {
        maximumFractionDigits: 2,
        style: "unit",
        unitDisplay: "short",
        unit: "kilometer",
    }).format(visibilityInKilometers);
}
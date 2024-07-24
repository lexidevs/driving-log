/**
 * Converts a number of minutes to a human-readable string representation.
 * @param min - The number of minutes to convert to a string.
 * @returns 
 */
function minutesToString(min: number): string {
    if (Math.trunc(min) === 0) {
        return "0m";
    }

    if (Math.trunc(min) % 60 === 0) {
        return `${Math.trunc(min / 60)}h`;
    }

    return `${Math.trunc(min / 60)}h ${Math.trunc(min) % 60}m`;
}

/**
 * Calculates the difference in minutes between two dates.
 * @param startDate - The starting date.
 * @param endDate - The ending date.
 * @returns The difference in minutes between the two dates.
 */
function datesToMinutes(startDate: Date, endDate: Date): number {
    return (endDate.getTime() - startDate.getTime()) / 60000;
}

export { minutesToString, datesToMinutes };

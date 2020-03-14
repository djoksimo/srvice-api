/* eslint-disable no-mixed-operators */
export class CalculationUtils {
  static calculateCrowDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = CalculationUtils.degreesToRadians(lat2 - lat1);
    const dLon = CalculationUtils.degreesToRadians(lon2 - lon1);
    const lat1Deg = CalculationUtils.degreesToRadians(lat1);
    const lat2Deg = CalculationUtils.degreesToRadians(lat2);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Deg) * Math.cos(lat2Deg);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // in kilometers
  }

  static degreesToRadians(degrees: number) {
    return degrees * (Math.PI / 180);
  }

  static average(numbers: number[], numDecimalPlaces: number) {
    if (numbers.length !== 0) {
      let sum = 0;
      numbers.forEach((num) => (sum += num));
      const average = sum / numbers.length;
      return Math.round(average * 10 ** numDecimalPlaces) / 10 ** numDecimalPlaces;
    }
    return 0;
  }
}

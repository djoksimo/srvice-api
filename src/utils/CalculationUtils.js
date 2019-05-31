class CalculationUtils {

  static calculateCrowDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);
    const lat1Deg = this.degreesToRadians(lat1);
    const lat2Deg = this.degreesToRadians(lat2);
    const a = (Math.sin(dLat / 2) * Math.sin(dLat / 2)) + (Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Deg) * Math.cos(lat2Deg));
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  static degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  static average(numbers, numDecimalPlaces) {
    if (numbers.length !== 0) {
      let sum = 0;
      numbers.forEach(num => sum += num);
      const average = sum / numbers.length;
      return Math.round(average * (10 ** numDecimalPlaces)) / (10 ** numDecimalPlaces);
    }
    return 0;
  }
}

module.exports = CalculationUtils;

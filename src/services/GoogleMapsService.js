const { GMP_PLACES_KEY } = require("../values/Keys");

class GoogleMapsService {

  async getCoordinatesFromPostalCode(postalCode) {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${postalCode}&key=${GMP_PLACES_KEY}`);
    return response.json();
  }
}

module.exports = GoogleMapsService;

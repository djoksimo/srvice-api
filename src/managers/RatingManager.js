const mongoose = require("mongoose");
const Rating = require("../models/RatingModel");
const route = "/rating/";

class RatingManager {

  constructor(AuthenticationManager, RatingService) {
    this._ratingService = RatingService;
    this._authenticationManager = AuthenticationManager;
  }

  async create(data) {
    const { forEmail, byEmail, rating, text, token } = data;
    const verificationBody = await this._authenticationManager.verifyToken(token);
    if (verificationBody.status === 403) {
      return { status: 403, json: verificationBody };
    }
    const newRating = new Rating({
      _id: new mongoose.Types.ObjectId(),
      forEmail,
      byEmail,
      date: new Date(),
      rating,
      text,
    });
    try {
      const result = await this._ratingService.create(newRating);
      return {
        status: 201,
        json: {
          message: "Rating added to database",
          request: {
            type: "POST",
            url: "http://" + "165.227.42.141:5000" + route,
          },
          result,
        },
      };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async queryWithForEmail(email) {
    try {
      const result = await this._ratingService.findByForEmail(email);
      if (!result) {
        return {
          status: 404,
          json: {
            message: "Ratings not found",
          },
        };
      }
      return {
        status: 200,
        json: {
          message: `Ratings addressed to ${email} pulled from database`,
          request: {
            type: "GET",
            url: `https://api.srvice.ca${route}name/${email}`
          },
          result
        },
      };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async find(id) {
    try {
      const result = await this._ratingService.find(id);
      if (!result) {
        return {
          status: 404,
          json: {
            message: "Rating not found",
          },
        };
      }
      return {
        status: 200,
        json: {
          message: "Rating pulled from database",
          request: {
            type: "GET",
            url: "http://" + "165.227.42.141:5000" + route + id,
          },
          result,
        },
      };
    } catch (error) {
      return { status: 500, json: error };
    }
  }



  async get() {
    try {
      const result = await this._ratingService.get();
      if (result.length === 0) {
        return {
          status: 404,
          json: {
            message: "No services found",
          },
        };
      }
      return {
        status: 200,
        json: {
          message: "All ratings pulled from database",
          request: {
            type: "GET",
            url: "http://" + "165.227.42.141:5000" + route,
          },
          result,
        },
      };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async update(data) {
    try {
      const verificationBody = await this._authenticationManager.verifyToken(data.token);
      if (verificationBody.status === 403) {
        return { status: 403, json: verificationBody };
      }
      const result = await this._ratingService.update(data._id, data);
      return {
        status: 200,
        json: {
          message: "Rating updated in database",
          request: {
            type: "PATCH",
            url: "http://" + "165.227.42.141:5000" + route,
          },
          result,
        },
      };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async remove(data) {
    try {
      const verificationBody = await this._authenticationManager.verifyToken(data.token);
      if (verificationBody.status === 403) {
        return { status: 403, json: verificationBody };
      }
      const result = await this._ratingService.remove(data.id);
      return {
        status: 200,
        json: {
          message: "Rating removed from database",
          request: {
            type: "DELETE",
            url: "http://" + "165.227.42.141:5000" + route,
          },
          result,
        },
      };
    } catch (error) {
      return { status: 500, json: error }
    }
  }
}

module.exports = RatingManager;

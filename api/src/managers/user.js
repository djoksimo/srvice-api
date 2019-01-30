const route = "/user/";

const jwt = require("jsonwebtoken");

const secretJwtKey = "8xStlNM+DbJTIQ0zOk+3X00gngEB9JOEKiVMYWAVWfc";

class UserManager {

  constructor(userService, ratingService) {
    this._userService = userService;
    this._ratingService = ratingService;
  }

  async find(email) {
    try {
      const result = await this._userService.find(email);
      if (!result) {
        return {
          status: 404,
          json: {
            message: "User not found",
          },
        };
      }

      result.ratings = await this._ratingService.findByForEmail(email);
      if (result.ratings.length === 0) {
        result.ratingAverage = 0.0;
      } else {
        let ratingSum = 0;
        result.ratings.forEach(rating => ratingSum += rating.rating);
        const ratingAverage = ratingSum / result.ratings.length;
        result.ratingAverage = Math.round(ratingAverage * 10) / 10;
      }

      return {
        status: 200,
        json: {
          message: "User pulled from database",
          request: {
            type: "GET",
            url: "http://" + "165.227.42.141:5000" + route + email,
          },
          result,
        },
      };
    } catch (error) {
	    console.log(error);
      return { status: 500, json: error };
    }
  }

  async findById(id) {
    try {
      const result = await this._userService.findById(id);
      if (!result) {
        return {
          status: 404,
          json: {
            message: "User not found",
          },
        };
      }

      result.ratings = await this._ratingService.findByForEmail(result.email);
      if (result.ratings.length === 0) {
        result.ratingAverage = 0.0;
      } else {
        let ratingSum = 0;
        result.ratings.forEach(rating => ratingSum += rating.rating);
        const ratingAverage = ratingSum / result.ratings.length;
        result.ratingAverage = Math.round(ratingAverage * 10) / 10;
      }
      return {
        status: 200,
        json: {
          message: "User pulled from database",
          request: {
            type: "GET",
            url: `http://165.227.42.141:5000${route}agent/${id}`,
          },
          result,
        },
      };
    } catch (error) {
      console.log(error);
      return { status: 500, json: error };
    }
  }

  async get() {
    try {
      const result = await this._userService.get();
      if (result.length === 0) {
        return {
          status: 404,
          json: {
            message: "No users found",
          },
        };
      }

      return {
        status: 200,
        json: {
          message: "All users pulled from database",
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

  _verifyToken(token) {
    return new Promise((resolve) => {
      jwt.verify(token, secretJwtKey, (err, authData) => {
        if (err) {
          resolve(err);
        } else {
          resolve(authData);
        }
      });
    });
  }


  async verifyToken(token) {
    const result = await this._verifyToken(token);
    if (!result.email) {
      return { status: 403, json: result };
    }
    try {
      const user = await this.find(result.email);
      return { status: 200, json: user };
    } catch (error) {
      return { status: 403, json: error };
    }
  }

  async update(data) {
    try {
      const verificationBody = await this.verifyToken(data.token);
      if (verificationBody.status === 403) {
        return { status: 403, json: verificationBody };
      }
      const result = await this._userService.update(data.email, data);
      return {
        status: 200,
        json: {
          message: "User updated in database",
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

}

module.exports = UserManager;

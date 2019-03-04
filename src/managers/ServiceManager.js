const mongoose = require("mongoose");
const { ServiceModel } = require("../models/");
const route = "/service/";

class ServiceManager {

  constructor(AuthenticationManager, ServiceService, CategoryService, AgentService) {
    this.authenticationManager = AuthenticationManager;
    this.serviceService = ServiceService;
    this.categoryService = CategoryService;
    this.agentService = AgentService;
  }

  async createService({ agent, category, title, description, pictureUrls, phone, email, inCall, outCall, remoteCall, address, latitude, longitude, radius, rating, ratings }) {
    const newService = new ServiceModel({ agent, category, title, description, pictureUrls, phone, email, inCall, outCall, remoteCall, address, latitude, longitude, radius, rating, ratings });
    // TODO: verify agent sending request
    try {
      const serviceDocument = await this.serviceService.createService(newService);
      await this.categoryService.addServiceToCategory(category, serviceDocument.toObject()._id);
      await this.agentService.addServiceToAgent(agent, serviceDocument.toObject()._id);
      return { status: 201, json: {} };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async create(data) {
    const {
      token,
      email, title, categoryId, pictureUrls, description,
      phone, contactEmail,
      latitude, longitude, radius,
      homeScreenGroups, schedule, products
    } = data;

    const newService = new ServiceModel({
      _id: new mongoose.Types.Mongoose.Schema.Types.ObjectId(),
      email,
      title,
      categoryId,
      pictureUrls,
      description,
      phone,
      contactEmail,
      latitude,
      longitude,
      radius,
      homeScreenGroups,
      schedule,
      products
    });
    try {
      const verificationBody = await this.authenticationManager.verifyToken(token);
      if (verificationBody.status === 403) {
        return { status: 403, json: verificationBody };
      }
      const result = await this.serviceService.create(newService);
      return {
        status: 201,
        json: {
          message: "Service added to database",
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

  async find(id) {
    try {
      const result = await this.serviceService.find(id);
      if (!result) {
        return {
          status: 404,
          json: {
            message: "Service not found",
          },
        };
      }

      return {
        status: 200,
        json: {
          message: "Service pulled from database",
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
      const result = await this.serviceService.get();
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
          message: "All services pulled from database",
          request: {
            type: "GET",
            url: "http://" + "165.227.42.141:5000" + route,
          },
          result,
        },
      };
    } catch (error) {
      return { status: 500, json : error };
    }
  }

  async getTwenty() {
    try {
      const result = await this.serviceService.getTwenty();
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
          message: "Twenty services pulled from database",
          request: {
            type: "GET",
            url: `http://165.227.42.141:5000${route}twenty`,
          },
          result,
        },
      };
    } catch (error) {
      return { status: 500, json : error };
    }
  }

  async update(data) {
    try {
      const verificationBody = await this.authenticationManager.verifyToken(data.token);
      if (verificationBody.status === 403) {
        return { status: 403, json: verificationBody };
      }

      const result = await this.serviceService.update(data._id, data);
      return {
        status: 200,
        json: {
          message: "Service updated in database",
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
      const verificationBody = await this.authenticationManager.verifyToken(data.token);
      if (verificationBody.status === 403) {
        return { status: 403, json: verificationBody };
      }
      const result = await this.serviceService.remove(data.id);
      return {
        status: 200,
        json: {
          message: "Service removed from database",
          request: {
            type: "DELETE",
            url: "http://" + "165.227.42.141:5000" + route,
          },
          result,
        },
      };
    } catch (error) {
      return {status: 500, json: error };
    }
  }

  async getHomeScreenServices() {
    try {
      const result = [];
      result.push({
        name: "Popular",
        services: await this.serviceService.findByHomeScreenGroup("Popular"),
      });
      result.push({
        name: "Toronto",
        services: await this.serviceService.findByHomeScreenGroup("Toronto"),
      });
      result.push({
        name: "Waterloo",
        services: await this.serviceService.findByHomeScreenGroup("Waterloo"),
      });
      result.push({
        name: "Kitchener",
        services: await this.serviceService.findByHomeScreenGroup("Kitchener"),
      });
      return {
        status: 200,
        json: {
          message: "Home screen services pulled from database",
          request: {
            type: "GET",
            url: "http://" + "165.227.42.141:5000" + route + "home",
          },
          result,
        },
      };
    } catch (error) {
      return {status: 500, json: error };
    }
  }

  async queryWithName(name) {
    try {
      const result = await this.serviceService.findByName(name);
      return {
        status: 200,
        json: {
          message: `Services with name containing "${name}" pulled from database`,
          request: {
            type: "GET",
            url: `https://api.srvice.ca${route}name/${name}`
          },
          result,
        },
      };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async queryWithCategory(categoryId) {
    try {
      const result = await this.serviceService.findByCategoryId(categoryId);
      return {
        status: 200,
        json: {
          message: "Services in category " + categoryId + " pulled from database",
          request: {
            type: "GET",
            url: `https://api.srvice.ca${route}name/${categoryId}`
          },
          result,
        },
      };
    } catch (error) {
      return { status: 500, json: error };
    }
  }
}

module.exports = ServiceManager;

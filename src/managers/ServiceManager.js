const { ServiceModel } = require("../models");
const { CalculationUtils } = require("../utils");

const MAX_CATEGORY_ENTRY_AGE = 600000;
const MAX_IN_CALL_DISTANCE = 50;

class ServiceManager {

  static get MAX_CATEGORY_ENTRY_AGE() { return MAX_CATEGORY_ENTRY_AGE; }
  static get MAX_IN_CALL_DISTANCE() { return MAX_IN_CALL_DISTANCE; }

  constructor(ServiceService, AgentService) {
    this.serviceService = ServiceService;
    this.agentService = AgentService;
    this.categoryToServiceMap = {};
  }

  async createService({ agent, category, title, description, pictureUrls, phone, email, inCall, outCall, remoteCall, address, latitude, longitude, radius, averageServiceRating, serviceRatings }) {
    const newService = new ServiceModel({ agent, category, title, description, pictureUrls, phone, email, inCall, outCall, remoteCall, address, latitude, longitude, radius, averageServiceRating, serviceRatings });
    // TODO: verify agent sending request
    try {
      const serviceDocument = await this.serviceService.saveService(newService);
      await this.agentService.addServiceToAgent(agent, serviceDocument.toObject()._id);
      return { status: 201, json: {} };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async getNearbyServicesByCategoryId({ categoryId, lat, lng }) {
    const categoryEntry = this.categoryToServiceMap[categoryId];
    if (!categoryEntry || Date.now() - categoryEntry.updatedAt >= ServiceManager.MAX_CATEGORY_ENTRY_AGE) {
      const serviceDocuments = await this.serviceService.findServicesByCategoryId(categoryId);
      this.categoryToServiceMap[categoryId] = { services: serviceDocuments, updatedAt: Date.now() };
    }
    const services = JSON.parse(JSON.stringify(this.categoryToServiceMap[categoryId].services)).filter((service) => {
      const { remoteCall, inCall, outCall, latitude, longitude, radius } = service;
      const distance = CalculationUtils.calculateCrowDistance(lat, lng, latitude, longitude);
      let possible = false;
      if (remoteCall) {
        possible = true;
      }
      if (inCall && distance < ServiceManager.MAX_IN_CALL_DISTANCE) {
        service.inCallDistance = distance;
        possible = true;
      }
      if (outCall && distance < radius) {
        service.inCallDistance = distance;
        service.outCallAvailable = true;
        possible = true;
      } else {
        service.outCallAvailable = false;
      }
      return possible;
    }).sort((a, b) => b.averageServiceRating - a.averageServiceRating);
    return { status: 200, json: { address, services } };
  }

  async getServiceById({ id }) {
    try {
      const result = await this.serviceService.findServiceById(id);
      if (!result) {
        return { status: 404, json: { message: "Service not found" } };
      }
      return { status: 200, json: result };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async patchService(service) {
    try {
      const result = await this.serviceService.updateService(service);
      return { status: 200, json: result };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async deleteService({ id }) {
    try {
      const result = await this.serviceService.removeService(id);
      return { status: 200, json: result };
    } catch (error) {
      return { status: 500, json: error };
    }
  }
}

module.exports = ServiceManager;

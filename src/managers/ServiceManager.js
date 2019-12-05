const { ServiceModel } = require("../models");
const { CalculationUtils } = require("../utils");

const MAX_CATEGORY_ENTRY_AGE = 600000;
const MAX_IN_CALL_DISTANCE = 50; // in kilometers

class ServiceManager {

  static get MAX_CATEGORY_ENTRY_AGE() { return MAX_CATEGORY_ENTRY_AGE; }
  static get MAX_IN_CALL_DISTANCE() { return MAX_IN_CALL_DISTANCE; }

  constructor(ServiceService, AgentService) {
    this.serviceService = ServiceService;
    this.agentService = AgentService;
    this.categoryToServiceMap = {};
  }

  async createService(payload) {
    const {
      agent,
      category,
      title,
      description,
      pictureUrls,
      phone,
      email,
      inCall,
      outCall,
      remoteCall,
      address,
      latitude,
      longitude,
      radius,
      averageServiceRating,
      serviceRatings,
      products,
    } = payload;
    const newService = new ServiceModel({
      agent,
      category,
      title,
      description,
      pictureUrls,
      phone,
      email,
      inCall,
      outCall,
      remoteCall,
      address,
      latitude,
      longitude,
      radius,
      averageServiceRating,
      serviceRatings,
      products,
    });

    try {
      const serviceDocument = await this.serviceService.saveService(newService);
      const serviceId = serviceDocument.toObject()._id;
      await this.agentService.addServiceToAgent(agent, serviceId);
      return { status: 201, json: { serviceId } };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async getNearbyServicesByCategoryId({ categoryId, lat, lng }) {
    const categoryEntry = this.categoryToServiceMap[categoryId];
    if (!categoryEntry || Date.now() - categoryEntry.updatedAt >= ServiceManager.MAX_CATEGORY_ENTRY_AGE) {
      const serviceDocuments = await this.serviceService.findServicesByCategoryId(categoryId).limit(500);
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
    console.log(services.length);
    return { status: 200, json: { services } };
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

  async patchService(service, authHeaders) {
    try {
      const result = await this.serviceService.updateService(service, authHeaders.agentId);
      return { status: 200, json: result };
    } catch (error) {
      return { status: 500, json: { error: error.toString() } };
    }
  }

  async deleteService(serviceId, authHeaders) {
    try {
      const result = await this.serviceService.removeService(serviceId, authHeaders.agentId);
      // TODO remove products and all other sub-documents in service (products, ratings, etc)
      return { status: 200, json: result };
    } catch (error) {
      return { status: 500, json: { error: error.toString() } };
    }
  }
}

module.exports = ServiceManager;

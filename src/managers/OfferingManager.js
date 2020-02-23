const { OfferingModel } = require("../models");

class OfferingManager {
  constructor(OfferingService, ServiceService) {
    this.offeringService = OfferingService;
    this.serviceService = ServiceService;
  }

  // TODO switch so that this creates a list of offerings - DANILO
  async createOffering(payload, authHeaders) {
    const { serviceId, title, duration, price, description, agent } = payload;

    const newOffering = new OfferingModel({
      title,
      duration,
      price,
      description,
      agent,
    });

    try {
      const offeringDocument = await this.offeringService.saveOffering(newOffering);
      await this.serviceService.addOfferingToService(serviceId, offeringDocument.toObject()._id, authHeaders.agentId);
      const offeringId = offeringDocument.toObject()._id;

      return { status: 201, json: { offeringId } };
    } catch (error) {
      console.log(error);
      return { status: 500, json: error };
    }
  }

  async patchOffering(offering, authHeaders) {
    try {
      const result = await this.offeringService.updateOffering(offering, authHeaders.agentId);
      return { status: 200, json: result };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async deleteOffering({ offeringId, serviceId }, authHeaders) {
    try {
      const offeringResult = await this.offeringService.removeOffering(offeringId, authHeaders.agentId);
      const serviceResult = await this.serviceService.removeOfferingFromService(
        serviceId,
        offeringId,
        authHeaders.agentId,
      );
      return { status: 200, json: { offeringResult, serviceResult } };
    } catch (error) {
      console.log(error);
      return { status: 500, json: error.toString() };
    }
  }
}

module.exports = OfferingManager;

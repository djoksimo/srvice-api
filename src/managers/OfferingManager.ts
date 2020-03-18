import { ObjectID } from "mongodb";

import { NewOfferingPayload } from "types/payloads";
import { AuthHeaders, Offering } from "../types";
import { OfferingModel } from "../models";
import { OfferingService, ServiceService } from "../services";

interface DeleteOfferingPayload {
  offeringId: ObjectID | string;
  serviceId: ObjectID | string;
}

export default class OfferingManager {
  offeringService: OfferingService;

  serviceService: ServiceService;

  constructor(offeringService: OfferingService, serviceService: ServiceService) {
    this.offeringService = offeringService;
    this.serviceService = serviceService;
  }

  // TODO switch so that this creates a list of offerings - DANILO
  async createOffering(payload: NewOfferingPayload, authHeaders: AuthHeaders) {
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

  async patchOffering(partialOfferingData: Partial<Offering>, authHeaders: AuthHeaders) {
    try {
      const result = await this.offeringService.updateOffering(partialOfferingData, authHeaders.agentId);
      return { status: 200, json: result };
    } catch (error) {
      console.log(error);
      return { status: 500, json: error };
    }
  }

  async deleteOffering({ offeringId, serviceId }: DeleteOfferingPayload, authHeaders: AuthHeaders) {
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

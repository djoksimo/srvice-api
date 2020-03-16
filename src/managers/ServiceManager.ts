import ServiceService from "services/ServiceService";
import OfferingService from "services/OfferingService";
import AgentService from "services/AgentService";
import ServiceRatingService from "services/ServiceRatingService";
import { ObjectID } from "mongodb";
import { Service, AuthHeaders, Offering, ServiceRating } from "types";
import { ServiceModel } from "../models";
import { CalculationUtils, ArrayUtils } from "../utils";

const MAX_CATEGORY_ENTRY_AGE = 600000;
const MAX_IN_CALL_DISTANCE = 50; // in kilometers

interface NewServicePayload {
  agent: ObjectID;
  category: ObjectID;
  title: Service["title"];
  description: Service["description"];
  pictureUrls: Service["pictureUrls"];
  phone: Service["phone"];
  email: Service["email"];
  inCall: Service["inCall"];
  outCall: Service["outCall"];
  remoteCall: Service["remoteCall"];
  address: Service["address"];
  latitude: Service["latitude"];
  longitude: Service["longitude"];
  radius: Service["longitude"];
  averageServiceRating: Service["averageServiceRating"];
  serviceRatings: Service["serviceRatings"];
  offerings: Service["offerings"];
  viewCount: Service["viewCount"];
}

interface NearbyServiceParams {
  categoryId: ObjectID;
  lat: number;
  lng: number;
}

interface CategoryEntry {
  updatedAt: number;
  services: Service[] | any;
}

interface CategoryMap {
  [categoryID: string]: CategoryEntry;
}

interface ServiceFilterItem extends Service {
  inCallDistance: number;
  outCallAvailable: boolean;
}

class ServiceManager {
  serviceService: ServiceService;

  agentService: AgentService;

  offeringService: OfferingService;

  serviceRatingService: ServiceRatingService;

  categoryToServiceMap: CategoryMap;

  static get MAX_CATEGORY_ENTRY_AGE() {
    return MAX_CATEGORY_ENTRY_AGE;
  }

  static get MAX_IN_CALL_DISTANCE() {
    return MAX_IN_CALL_DISTANCE;
  }

  constructor(
    serviceService: ServiceService,
    agentService: AgentService,
    offeringService: OfferingService,
    serviceRatingService: ServiceRatingService,
  ) {
    this.serviceService = serviceService;
    this.agentService = agentService;
    this.offeringService = offeringService;
    this.serviceRatingService = serviceRatingService;
    this.categoryToServiceMap = {};
  }

  async createService(payload: NewServicePayload) {
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
      offerings,
      viewCount,
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
      offerings,
      viewCount,
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

  async getNearbyServicesByCategoryId({ categoryId, lat, lng }: NearbyServiceParams) {
    const categoryIdString = String(categoryId);

    const categoryEntry = this.categoryToServiceMap[categoryIdString];
    if (!categoryEntry || Date.now() - categoryEntry.updatedAt >= ServiceManager.MAX_CATEGORY_ENTRY_AGE) {
      const serviceDocuments = await this.serviceService.findServicesByCategoryId(categoryId);
      this.categoryToServiceMap[categoryIdString] = { services: serviceDocuments, updatedAt: Date.now() };
    }
    const parsedServices = JSON.parse(JSON.stringify(this.categoryToServiceMap[categoryIdString].services));
    const isValidService = (service: ServiceFilterItem) => {
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
    };
    const filteredServices = Array.from(ArrayUtils.filterWithLimit(parsedServices, isValidService, 500));
    filteredServices.sort((a, b) => b.averageServiceRating - a.averageServiceRating);
    return { status: 200, json: { services: filteredServices } };
  }

  async getServiceById({ id }: { id: ObjectID }) {
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

  async updateViewCountById(serviceId: ObjectID) {
    this.serviceService.updateViewCount(serviceId);
  }

  async patchService(newPartialServiceData: Partial<Service>, authHeaders: AuthHeaders) {
    try {
      const result = await this.serviceService.updateService(newPartialServiceData, authHeaders.agentId);
      return { status: 200, json: result };
    } catch (error) {
      return { status: 500, json: { error: error.toString() } };
    }
  }

  async deleteService(serviceId: ObjectID, authHeaders: AuthHeaders) {
    try {
      const serviceDocument: any = await this.serviceService.findServiceById(serviceId);

      if (serviceDocument && serviceDocument.isDeleted) {
        return { status: 400, json: { message: "Service already deleted" } };
      }

      await Promise.all([
        ...serviceDocument.offerings.map((offering: Offering) => {
          offering.isDeleted = true;
          return this.offeringService.updateOffering(offering, authHeaders.agentId);
        }),
        ...serviceDocument.serviceRatings.map((serviceRating: ServiceRating) => {
          serviceRating.isDeleted = true;
          return this.serviceRatingService.updateServiceRatingWithoutAuth(serviceRating);
        }),
      ]);

      const result = await this.serviceService.removeService(serviceId, authHeaders.agentId);

      return { status: 200, json: result };
    } catch (error) {
      console.log(error);
      return { status: 500, json: { error: error.toString() } };
    }
  }
}

export default ServiceManager;

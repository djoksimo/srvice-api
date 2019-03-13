const Mongoose = require("mongoose");

const { BookingModel, RequestModel } = require("../models");

class RequestManager {

  constructor(ServiceService, BookingService, AgentPrivateService, RequestService, UserPrivateService) {
    this.serviceService = ServiceService;
    this.bookingService = BookingService;
    this.agentPrivateService = AgentPrivateService;
    this.requestService = RequestService;
    this.userPrivateService = UserPrivateService;
  }

  async createRequest({ email, id: user, description, pictureUrls, serviceIds, booked }) {
    try {
      const requestId = Mongoose.Types.ObjectId();
      const bookings = await Promise.all(serviceIds.map(async service =>{
        const serviceDocument = await this.serviceService.getSemiPopulatedAgentServiceById(service);
        const { agent } = serviceDocument;
        const newBooking = new BookingModel({ request: requestId, agent: agent._id, service, priceEstimate: -1, agentAccepted: false, userAccepted: false });
        const bookingDocument = await this.bookingService.createBooking(newBooking);
        await this.agentPrivateService.addBookingToAgentPrivate(agent.email, bookingDocument._id);
        return bookingDocument._id;
      }));
      const newRequest = new RequestModel({ _id: requestId, user, description, pictureUrls, bookings, booked });
      const requestDocument = await this.requestService.createRequest(newRequest);
      await this.userPrivateService.addRequestToUserPrivate(email, requestDocument._id);
      return { status: 201, json: requestDocument };
    } catch (error) {
      return { status: 500, json: error };
    }
  }
}

module.exports = RequestManager;

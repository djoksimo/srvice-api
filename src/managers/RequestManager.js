const Mongoose = require("mongoose");

const { BookingModel, RequestModel } = require("../models");

class RequestManager {
  constructor(serviceService, bookingService, agentPrivateService, requestService, userPrivateService) {
    this.serviceService = serviceService;
    this.bookingService = bookingService;
    this.agentPrivateService = agentPrivateService;
    this.requestService = requestService;
    this.userPrivateService = userPrivateService;
  }

  async createRequest({ email, userId: user, description, pictureUrls, serviceIds, booked }) {
    try {
      const requestId = Mongoose.Types.ObjectId();
      const bookings = await Promise.all(
        serviceIds.map(async (service) => {
          const serviceDocument = await this.serviceService.findSemiPopulatedAgentServiceById(service);
          const { agent } = serviceDocument;
          const newBooking = new BookingModel({
            request: requestId,
            agent: agent._id,
            service,
            priceEstimate: -1,
            timeEstimate: -1,
            agentAccepted: false,
            userAccepted: false,
          });
          const bookingDocument = await this.bookingService.createBooking(newBooking);
          await this.agentPrivateService.addBookingToAgentPrivate(agent.email, bookingDocument._id);
          return bookingDocument._id;
        }),
      );
      const newRequest = new RequestModel({ _id: requestId, user, description, pictureUrls, bookings, booked });
      const requestDocumentNonPopulated = await this.requestService.saveRequest(newRequest);
      const requestDocument = await this.requestService.getRequestById(requestDocumentNonPopulated._id);
      await this.userPrivateService.addRequestToUserPrivate(email, requestDocument._id);
      return { status: 201, json: requestDocument };
    } catch (error) {
      return { status: 500, json: { error: error.toString() } };
    }
  }
}

module.exports = RequestManager;

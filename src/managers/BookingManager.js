class BookingManager {

  constructor(BookingService, UserPrivateService) {
    this.bookingService = BookingService;
    this.userPrivateService = UserPrivateService;
  }

  async acceptBookingAgent({ bookingId, priceEstimate, timeEstimate, agentAccepted }) {
    try {
      await this.bookingService.updatePriceEstimateAgentAcceptedById(bookingId, priceEstimate, timeEstimate, agentAccepted);
      // TODO: push notifications
      const bookingDocument = await this.bookingService.getBookingById(bookingId);
      return { status: 200, json: bookingDocument };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async acceptBookingUser({ email, bookingId }) {
    try {
      await this.bookingService.updateUserAcceptedById(bookingId, true);
      await this.userPrivateService.addBookingToUserPrivate(email, bookingId);
      // TODO: push notifications
      const bookingDocument = await this.bookingService.getBookingById(bookingId);
      return { status: 200, json: bookingDocument };
    } catch (error) {
      return { status: 500, json: error };
    }
  }
}

module.exports = BookingManager;

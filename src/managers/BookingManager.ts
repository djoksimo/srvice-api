import BookingService from "services/BookingService";
import UserPrivateService from "services/UserPrivateService";
import { AuthHeaders, Minutes } from "types";
import { ObjectID } from "mongodb";

interface BookingAgentPayload {
  bookingId: ObjectID;
  priceEstimate: number;
  timeEstimate: Minutes;
  agentAccepted: boolean;
}

interface BookingUserPayload {
  email: string;
  bookingId: ObjectID;
}

export default class BookingManager {
  bookingService: BookingService;

  userPrivateService: UserPrivateService;

  constructor(bookingService: BookingService, userPrivateService: UserPrivateService) {
    this.bookingService = bookingService;
    this.userPrivateService = userPrivateService;
  }

  async acceptBookingAgent(
    { bookingId, priceEstimate, timeEstimate, agentAccepted }: BookingAgentPayload,
    authHeaders: AuthHeaders,
  ) {
    try {
      await this.bookingService.updatePriceEstimateAgentAcceptedById(
        bookingId,
        priceEstimate,
        timeEstimate,
        agentAccepted,
        authHeaders.agentId,
      );
      // TODO: push notifications
      const bookingDocument = await this.bookingService.getBookingById(bookingId);
      return { status: 200, json: bookingDocument };
    } catch (error) {
      return { status: 500, json: { error: error.toString() } };
    }
  }

  async acceptBookingUser({ email, bookingId }: BookingUserPayload) {
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

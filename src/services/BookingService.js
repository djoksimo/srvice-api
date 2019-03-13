class BookingService {
  createBooking(newBooking) {
    return newBooking.save();
  }
}

module.exports = BookingService;

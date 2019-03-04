const Rating = require("../models/RatingModel");

class RatingService {
  async create(data) {
    return data.save();
  }

  async find(id) {
    return Rating.findById(id).exec();
  }

  async findByForEmail(email) {
    return Rating.find({ forEmail: email }).exec();
  }

  async get() {
    return Rating.find().exec();
  }

  async update(id, data) {
    return Rating.update({ _id: id }, { $set: data }).exec();
  }

  async remove(id) {
    return Rating.remove({ _id: id }).exec();
  }
}

module.exports = RatingService;

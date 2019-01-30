const User = require("../models/user");

class UserService {
  async create(data) {
    return data.save();
  }

  async find(email) {
    return User.findOne({ email }).populate('services savedServices').exec();
  }

  async findById(id) {
    return User.findById(id).populate('services savedServices').exec();
  }

  async get() {
    return User.find().exec();
  }

  async update(email, data) {
    return User.update({ email }, { $set: data }).exec();
  }
}

module.exports = UserService;

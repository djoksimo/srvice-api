const { UserModel } = require("../models");

class UserService {
  async create(data) {
    return data.save();
  }

  async find(email) {
    return UserModel.findOne({ email }).populate('services savedServices').exec();
  }

  async findById(id) {
    return UserModel.findById(id).populate('services savedServices').exec();
  }

  async get() {
    return UserModel.find().exec();
  }

  async updateUser(user) {
    return UserModel.update({ _id: user._id }, { $set: user }).exec();
  }
}

module.exports = UserService;

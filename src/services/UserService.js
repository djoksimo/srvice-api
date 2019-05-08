const { UserModel } = require("../models");

class UserService {
  createUser(newUser) {
    return newUser.save();
  }

  findUserById(id) {
    return UserModel.findById(id).exec();
  }

  findUserByEmail(email) {
    return UserModel.findOne({ email }).exec();
  }

  findNonPopulatedUserById(id) {
    return UserModel.findById(id).exec();
  }

  updateUser(user) {
    return UserModel.update({ _id: user._id }, { $set: user }).exec();
  }
}

module.exports = UserService;

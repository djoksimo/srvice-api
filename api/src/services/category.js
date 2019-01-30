const Category = require("../models/category");

class CategoryService {
  async create(data) {
    return data.save();
  }

  async find(id) {
    return Category.findById(id).exec();
  }

  async get() {
    return Category.find().exec();
  }

  async update(id, data) {
    return Category.update({ _id: id }, { $set: data }).exec();
  }

  async getRootCategories() {
    return Category.find({ isRoot: true }).exec();
  }

  async findWithParentId(id) {
    return Category.find({ parentId: id }).exec();
  }
}

module.exports = CategoryService;

const { CategoryModel } = require("../models/");

class CategoryService {

  createCategory(newCategory) {
    return newCategory.save();
  }

  getAllCategories() {
    return CategoryModel.find().exec();
  }

  getCategoryById(id) {
    return CategoryModel.findById(id).exec();
  }

  deleteCategory(id) {
    return CategoryModel.remove({ _id: id }).exec();
  }

  updateCategory(category) {
    return CategoryModel.update({ _id: category._id }, { $set: category }).exec();
  }

  async find(id) {
    return CategoryModel.findById(id).exec();
  }

  async get() {
    return CategoryModel.find().exec();
  }

  async update(id, data) {
    return CategoryModel.update({ _id: id }, { $set: data }).exec();
  }

  async getRootCategories() {
    return CategoryModel.find({ isRoot: true }).exec();
  }

  async findWithParentId(id) {
    return CategoryModel.find({ parentId: id }).exec();
  }
}

module.exports = CategoryService;

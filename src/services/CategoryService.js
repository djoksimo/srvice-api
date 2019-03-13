const { CategoryModel } = require("../models/");

class CategoryService {

  createCategory(newCategory) {
    return newCategory.save();
  }

  getAllCategories() {
    return CategoryModel.find().exec();
  }

  getCategoryByIdWithoutServices(id) {
    return CategoryModel.findById(id).select("-services").exec();
  }

  getCategoryById(id) {
    return CategoryModel.findById(id).populate("services").exec();
  }

  deleteCategory(id) {
    return CategoryModel.remove({ _id: id }).exec();
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

const { CategoryModel } = require("../models/");

class CategoryService {
  createCategory(newCategory) {
    return newCategory.save();
  }

  getAllCategories() {
    return CategoryModel.find()
      .limit(30)
      .exec();
  }

  getCategoryByIdWithoutServices(id) {
    return CategoryModel.findById(id)
      .select("-services")
      .exec();
  }

  deleteCategory(id) {
    return CategoryModel.remove({ _id: id }).exec();
  }

  async find(id) {
    return CategoryModel.findById(id).exec();
  }

  async updateCategory(partialCategory) {
    return CategoryModel.findByIdAndUpdate(partialCategory._id, { $set: partialCategory }).exec();
  }
}

module.exports = CategoryService;

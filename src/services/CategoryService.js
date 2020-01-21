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

  async update(category) {
    return CategoryModel.update({ _id: category.id }, { $set: category }).exec();
  }
}

module.exports = CategoryService;

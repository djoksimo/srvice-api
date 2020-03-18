import { CategoryModel } from "../models";

export default class CategoryService {
  createCategory(newCategory: { save: () => any }) {
    return newCategory.save();
  }

  getAllCategories() {
    return CategoryModel.find()
      .limit(30)
      .exec();
  }

  getCategoryByIdWithoutServices(id: any) {
    return CategoryModel.findById(id)
      .select("-services")
      .exec();
  }

  deleteCategory(id: any) {
    return CategoryModel.remove({ _id: id }).exec();
  }

  async find(id: any) {
    return CategoryModel.findById(id).exec();
  }

  async updateCategory(partialCategory: { _id: any }) {
    return CategoryModel.findByIdAndUpdate(partialCategory._id, partialCategory, { new: true }).exec();
  }
}

const { CategoryModel } = require("../models");

const route = "/category";

class CategoryManager {

  constructor(CategoryService, ServiceService) {
    this.categoryService = CategoryService;
    this.serviceService = ServiceService;
  }

  async createCategory({ name }) {
    const newCategory = new CategoryModel({ name });
    try {
      const result = await this.categoryService.createCategory(newCategory);
      return { status: 201, json: result };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async getAllCategories() {
    const result = await this.categoryService.getAllCategories();
    return { status: 200, json: result };
  }

  async deleteCategory({ id }) {
    try {
      const result = await this.categoryService.deleteCategory(id);
      return { status: 200, json: result };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async getHomeCategories() {
    const categoryIds = ["5c7cbbcae344b32a42dc06ad", "5c7cbc15e344b32a42dc06b2"];
    try {
      const categoryDocumentsPromise = categoryIds.map(async id =>
        await this.categoryService.getCategoryByIdWithoutServices(id)
      );
      const categoryDocuments = await Promise.all(categoryDocumentsPromise);
      return { status: 200, json: categoryDocuments };
    } catch (error) {
      return { status: 500, json: error };
    }
  }
}

module.exports = CategoryManager;

const { CategoryModel } = require("../models");

const HOME_CATEGORY_IDS = ["5c7cbbcae344b32a42dc06ad", "5c7cbc15e344b32a42dc06b2"];

class CategoryManager {

  static get HOME_CATEGORY_IDS() { return HOME_CATEGORY_IDS; }

  constructor(CategoryService) {
    this.categoryService = CategoryService;
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

  async deleteCategory({ id }) {
    try {
      const result = await this.categoryService.deleteCategory(id);
      return { status: 200, json: result };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async getHomeCategories() {
    try {
      const categoryDocumentsPromise = CategoryManager.HOME_CATEGORY_IDS.map(async id => this.categoryService.findCategoryById(id));
      const categoryDocuments = await Promise.all(categoryDocumentsPromise);
      return { status: 200, json: categoryDocuments };
    } catch (error) {
      return { status: 500, json: error };
    }
  }
}

module.exports = CategoryManager;

const { CategoryModel } = require("../models");

class CategoryManager {

  constructor(CategoryService) {
    this.categoryService = CategoryService;
  }

  async createCategory({ name, iconUrl }) {
    const newCategory = new CategoryModel({ name, iconUrl });
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
    const categoryIds = [
      "5d116d75c88f3f36a7210acb",
      "5d116ee94c533b38dab4e0ea",
      "5d116f114c533b38dab4e0eb",
      "5d116f224c533b38dab4e0ec",
      "5d116f304c533b38dab4e0ed",
      "5d116f3c4c533b38dab4e0ee",
      "5d116f4f4c533b38dab4e0ef",
      "5d116f5d4c533b38dab4e0f0",
    ];
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

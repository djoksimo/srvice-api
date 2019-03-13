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

  async find(id) {
    try {
      const result = await this.categoryService.find(id);
      result.children = await this._getCategoryChildren(result);
      result.services = await this.serviceService.findByCategoryId(result._id);
      if (!result) {
        return {
          status: 404,
          json: {
            message: "Category not found",
          },
        };
      }
      return {
        status: 200,
        json: {
          message: "Category pulled from database",
          request: {
            type: "GET",
            url: "http://" + "165.227.42.141:5000" + route + id,
          },
          result,
        },
      };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async get() {
    try {
      const result = await this.categoryService.get();
      if (result.length === 0) {
        return {
          status: 404,
          json: {
            message: "No categories found",
          },
        };
      }
      return {
        status: 200,
        json: {
          message: "All categories pulled from database",
          request: {
            type: "GET",
            url: "http://" + "165.227.42.141:5000" + route,
          },
          result,
        },
      };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async _getCategoryChildren(category) {
    const children = await this.categoryService.findWithParentId(category._id);
    for (let i = 0; i < children.length; i++) {
      children[i].children = await this._getCategoryChildren(children[i]);
      children[i].services = await this.serviceService.findByCategoryId(children[i]._id);
    }
    return children;
  }
}

module.exports = CategoryManager;

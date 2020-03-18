import { ObjectID } from "mongodb";

import { Category } from "../types";
import { CategoryModel } from "../models";

import { CategoryService } from "../services";

interface NewCategoryPayload {
  name: string;
  iconUrl: string;
  placeholderInputServiceTitle: string;
  placeholderInputServiceDescription: string;
}

interface NewPartialCategoryData extends Partial<Category> {
  _id: ObjectID;
}

export default class CategoryManager {
  categoryService: CategoryService;

  constructor(categoryService: CategoryService) {
    this.categoryService = categoryService;
  }

  async createCategory({
    name,
    iconUrl,
    placeholderInputServiceTitle,
    placeholderInputServiceDescription,
  }: NewCategoryPayload) {
    const newCategory = new CategoryModel({
      placeholderInputServiceTitle,
      placeholderInputServiceDescription,
      name,
      iconUrl,
    });
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

  async deleteCategory({ id }: { id: ObjectID }) {
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
      const categoryDocumentsPromise = categoryIds.map(
        async (id) => await this.categoryService.getCategoryByIdWithoutServices(id),
      );
      const categoryDocuments = await Promise.all(categoryDocumentsPromise);
      return { status: 200, json: categoryDocuments };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async patchCategory(newPartialCategoryData: NewPartialCategoryData) {
    try {
      const result = await this.categoryService.updateCategory(newPartialCategoryData);
      return { status: 200, json: result };
    } catch (error) {
      return { status: 500, json: error };
    }
  }
}

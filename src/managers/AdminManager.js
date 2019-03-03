const mongoose = require("mongoose");

const Category = require("../models/CategoryModel");

const route = "/admin/";

class AdminManager {

  constructor(AuthenticationManager, CategoryService) {
    this._authenticationManager = AuthenticationManager;
    this._categoryService = CategoryService;

  }

  async createCategory(data) {
    const { name, isRoot, parentId, childrenIds, serviceIds, token} = data;

    const newCategory = new Category({
      _id: new mongoose.Types.ObjectId(),
      name,
      isRoot,
      parentId,
      childrenIds,
      serviceIds,
    });
    try {

      const verificationBody = await this._authenticationManager.verifyToken(token);
      if (verificationBody.status === 403) {
        return {
          status: 403,
          json: verificationBody
        }
      }
      const result = await this._categoryService.create(newCategory);
      return {
        status: 201,
        json: {
          message: "Category added to database",
          request: {
            type: "POST",
            url: "http://" + "165.227.42.141:5000" + route + "category",
          },
          result,
        },
      };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async updateCategory(data) {
    try {
      const verificationBody = await this._authenticationManager.verifyToken(data.token);
      if (verificationBody.status === 403) {
        return {
          status: 403,
          json: verificationBody
        }
      }
      const result = await this._categoryService.update(data._id, data);
      return {
        status: 200,
        json: {
          message: "Category updated in database",
          request: {
            type: "PATCH",
            url: "http://" + "165.227.42.141:5000" + route + "category",
          },
          result,
        },
      };
    } catch (error) {
      return { status: 500, json: error };
    }
  }
}

module.exports = AdminManager;

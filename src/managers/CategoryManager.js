const route = "/category";

class CategoryManager {

  constructor(
    categoryService,
    serviceService) {
    this._categoryService = categoryService;
    this._serviceService = serviceService;
    this._categoryTree = [];

    try {
      this._makeCategoryTree().catch(err => console.log(err));
      setInterval(this._makeCategoryTree, 300000);
    } catch (error) {
      console.log(error);
    }

  }

  async find(id) {
    try {
      const result = await this._categoryService.find(id);
      result.children = await this._getCategoryChildren(result);
      result.services = await this._serviceService.findByCategoryId(result._id);
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
      const result = await this._categoryService.get();
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

  async getCategoryTree() {
    try {
      return {
        status: 200,
        json: {
          tree: this._categoryTree,
        },
      };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async _makeCategoryTree() {
    console.log("Making new category tree");
    try {
      console.log("Root Categories: ", this._categoryService.getRootCategories());
      this._categoryTree = await this._categoryService.getRootCategories();
      for (let i = 0; i < this._categoryTree.length; i++) {
        this._categoryTree[i].children = await this._getCategoryChildren(this._categoryTree[i]);
        this._categoryTree[i].services = await this._serviceService.findByCategoryId(this._categoryTree[i]._id);
      }
    } catch (err) {
      console.log(err);
    }

  }

  async _getCategoryChildren(category) {
    const children = await this._categoryService.findWithParentId(category._id);
    for (let i = 0; i < children.length; i++) {
      children[i].children = await this._getCategoryChildren(children[i]);
      children[i].services = await this._serviceService.findByCategoryId(children[i]._id);
    }
    return children;
  }
}

module.exports = CategoryManager;

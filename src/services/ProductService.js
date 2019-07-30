const { ProductModel } = require("../models");

class ProductService {

  saveProduct(newProduct) {
    return newProduct.save();
  }

  updateProduct(product) {
    return ProductModel.update({ _id: product._id }, { $set: product }).exec();
  }

  removeProduct(id) {
    return ProductModel.remove({ _id: id }).exec();
  }
}

module.exports = ProductService;

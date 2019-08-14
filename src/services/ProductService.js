const { ProductModel } = require("../models");

class ProductService {
  static isOwner(productId, agentId) {
    return new Promise((resolve, reject) => {
      ProductModel.findById(productId, (err, product) => {
        if (err) {
          return reject(err);
        }
        if (!product) {
          return reject(new Error("Could not find product"));
        }
        if (agentId.toString() !== product.toObject().agent.toString()) {
          resolve(false);
        }
        return resolve(true);
      });
    });
  }

  saveProduct(newProduct) {
    return newProduct.save();
  }

  async updateProduct(product, agentId) {
    const isOwner = await ProductService.isOwner(product._id, agentId);
    if (!isOwner) {
      throw new Error("NICE TRY");
    }
    return ProductModel.updateOne({ _id: product._id }, { $set: product }).exec();
  }

  async removeProduct(productId, agentId) {
    const isOwner = await ProductService.isOwner(productId, agentId);
    if (!isOwner) {
      throw new Error("NICE TRY");
    }
    return ProductModel.deleteOne({ _id: id }).exec();
  }
}

module.exports = ProductService;

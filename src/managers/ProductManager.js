const { ProductModel } = require("../models");

class ProductManager {

  constructor(ProductService, ServiceService) {
    this.productService = ProductService;
    this.serviceService = ServiceService;
  }

  async createProduct(payload) {
    const {
      serviceId,
      title,
      duration,
      price,
      description,
    } = payload;

    const newProduct = new ProductModel({
      title,
      duration,
      price,
      description,
    });

    try {
      const productDocument = await this.productService.saveProduct(newProduct);
      await this.serviceService.addProductToService(serviceId, productDocument.toObject()._id);
      return { status: 201, json: {} };
    } catch (error) {
      console.log(error);
      return { status: 500, json: error };
    }
  }

  async patchProduct(product) {
    try {
      const result = await this.productService.updateProduct(product);
      return { status: 200, json: result };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async deleteProduct({ productId, serviceId }) {
    try {
      const productResult = await this.productService.removeProduct(productId);
      const serviceResult = await this.serviceService.removeProductFromService(serviceId, productId);
      return { status: 200, json: { productResult, serviceResult } };
    } catch (error) {
      return { status: 500, json: error };
    }
  }
}

module.exports = ProductManager;

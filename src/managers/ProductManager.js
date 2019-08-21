const { ProductModel } = require("../models");

class ProductManager {

  constructor(ProductService, ServiceService) {
    this.productService = ProductService;
    this.serviceService = ServiceService;
  }

  // TODO switch so that this creates a list of products - DANILO
  async createProduct(payload, authHeaders) {
    const {
      serviceId,
      title,
      duration,
      price,
      description,
      agent,
    } = payload;

    const newProduct = new ProductModel({
      title,
      duration,
      price,
      description,
      agent,
    });

    try {
      const productDocument = await this.productService.saveProduct(newProduct);
      await this.serviceService.addProductToService(serviceId, productDocument.toObject()._id, authHeaders.agentId);
      const productId = productDocument.toObject()._id;

      return { status: 201, json: { productId } };
    } catch (error) {
      console.log(error);
      return { status: 500, json: error };
    }
  }

  async patchProduct(product, authHeaders) {
    try {
      const result = await this.productService.updateProduct(product, authHeaders.agentId);
      return { status: 200, json: result };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  async deleteProduct({ productId, serviceId }, authHeaders) {
    try {
      const productResult = await this.productService.removeProduct(productId, authHeaders.agentId);
      const serviceResult = await this.serviceService.removeProductFromService(serviceId, productId, authHeaders.agentId);
      return { status: 200, json: { productResult, serviceResult } };
    } catch (error) {
      console.log(error);
      return { status: 500, json: error.toString() };
    }
  }
}

module.exports = ProductManager;

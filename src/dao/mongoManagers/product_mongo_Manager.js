import Products from "../../models/product.model.js";

class ProductManager {
  // Método para leer productos con opciones de paginación, filtros y ordenamiento
  async readProducts({
    page = 1,
    limit = 10,
    sort = "asc",
    category = null,
    available = null,
  }) {
    try {
      const options = {
        page: page,
        limit: limit,
        sort: { price: sort === "desc" ? -1 : 1 },
      };
  
      const filter = {};
      if (category) {
        filter.category = category;
      }
      if (available !== null) {
        filter.stock = available ? { $gt: 0 } : 0;
      }
  
      const totalProducts = await Products.countDocuments(filter);
      const products = await Products.paginate(filter, options);
  
      const totalPages = Math.ceil(totalProducts / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;
  
      const response = {
        status: "success",
        payload: products.docs,
        totalPages,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage
          ? `${req.baseUrl}?page=${
              page - 1
            }&limit=${limit}&sort=${sort}&category=${category}&available=${available}`
          : null,
        nextLink: hasNextPage
          ? `${req.baseUrl}?page=${
              page + 1
            }&limit=${limit}&sort=${sort}&category=${category}&available=${available}`
          : null,
      };
  
      return response; // <-- Agregar esta línea para retornar el objeto response
    } catch (error) {
      console.log("Error al leer los productos de MongoDb:", error.message);
      throw new Error("Error al obtener los productos");
    }
  }

  // Método para agregar un nuevo producto a la base de datos
  async addProduct(product) {
    try {
      await Products.create(product);
    } catch (error) {
      console.log("Error al agregar el producto:", error.message);
    }
  }

  // Método para obtener todos los productos de la base de datos
  async getProducts() {
    try {
      return await Products.find();
    } catch (error) {
      console.log("Error al obtener los productos:", error.message);
      return [];
    }
  }

  // Método para obtener todos los productos de la base de datos con lean
  async getLeanProducts() {
    try {
      return await Products.find().lean();
    } catch (error) {
      console.log("Error al obtener los productos con lean:", error.message);
      return [];
    }
  }

  // Método para obtener un producto por su ID desde la base de datos
  async getProductById(id) {
    try {
      return await Products.findById(id);
    } catch (error) {
      throw new Error(
        `Error al obtener el producto con ID ${id}: ${error.message}`
      );
    }
  }

  // Método para actualizar un producto en la base de datos por su ID
  async updateProduct(id, product) {
    try {
      return await Products.findByIdAndUpdate(id, { $set: product });
    } catch (error) {
      return error;
    }
  }

  // Método para eliminar un producto de la base de datos por su ID
  async deleteProduct(id) {
    try {
      const product = await Products.findById(id);
      if (product) {
        await product.deleteOne();
      } else {
        throw new Error(`Producto con ID ${id} no encontrado.`);
      }
    } catch (error) {
      throw new Error(
        `Error al eliminar el producto con ID ${id}: ${error.message}`
      );
    }
  }

  // Método para obtener el número total de páginas para la paginación
  getTotalPages() {
    return this.totalPages;
  }

  // Método para generar los enlaces de paginación para las solicitudes
  getPaginationLinks(req) {
    const { page, limit, sort, category, available } = req.query;
    const totalPages = this.getTotalPages();

    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;

    const prevPage = parseInt(page) > 1 ? parseInt(page) - 1 : null;
    const nextPage = parseInt(page) < totalPages ? parseInt(page) + 1 : null;

    const prevLink = prevPage
      ? `${baseUrl}?page=${prevPage}&limit=${limit}&sort=${sort}&category=${category}&available=${available}`
      : null;
    const nextLink = nextPage
      ? `${baseUrl}?page=${nextPage}&limit=${limit}&sort=${sort}&category=${category}&available=${available}`
      : null;

    return {
      totalPages,
      prevLink,
      nextLink,
    };
  }
}

export default ProductManager;

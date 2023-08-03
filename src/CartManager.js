

class CartManager {
  constructor(productManager) {
    this.productManager = productManager;
    this.readCarts();
  }

  async readCarts() {
    try {
      const carts = await Cart.find();
      this.carts = carts;
    } catch (error) {
      console.log("Error al leer los carritos de MongoDB:", error.message);
    }
  }

  async writeCarts() {
    try {
      await Cart.insertMany(this.carts);
    } catch (error) {
      console.log("Error al escribir los carritos en MongoDB:", error.message);
    }
  }

  getCarts() {
    return this.carts;
  }

  addCart() {
    const newCart = {
      id,
      products: [],
    };
    this.carts.push(newCart);
    this.writeCarts();
  }

  getCartById(cartId) {
    const cart = this.carts.find((cart) => cart.id == cartId);
    if (!cart) {
      throw new Error(`Carrito con el id ${cartId} no encontrado`);
    }

    return cart; // Retornar el objeto cart completo con id y products
  }

  async addProductToCart(cartId, productId) {
    try {
      // Obtener el carrito específico por su ID
      const cart = await Cart.findOne({ id: cartId });

      // Obtener el producto específico por su ID
      const product = await this.productManager.getProductById(productId);

      // Verificar si el producto ya existe en el carrito
      const existingProduct = cart.products.find((p) => p.id === productId);

      if (existingProduct) {
        // Si el producto existe, incrementar la cantidad en 1
        existingProduct.quantity += 1;
      } else {
        // Si el producto no existe, agregarlo al carrito con cantidad 1
        cart.products.push({ ...product.toObject(), quantity: 1 });
      }

      // Guardar los cambios en MongoDB
      await cart.save();
    } catch (error) {
      throw new Error(
        `Error al agregar el producto al carrito: ${error.message}`
      );
    }
  }
}

export default CartManager;

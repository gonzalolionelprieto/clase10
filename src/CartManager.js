import { readFile, writeFile } from "fs/promises";

class CartManager {
  constructor(path) {
    this.path = path;
    this.carts = [];
    this.readCarts();
  }

  async readCarts() {
    try {
      const data = await readFile(this.path, "utf-8");
      this.carts = JSON.parse(data);
    } catch (error) {
      console.log("Error al leer el archivo de carritos:", error.message);
    }
  }

  async writeCarts() {
    try {
      await writeFile(this.path, JSON.stringify(this.carts), "utf-8");
    } catch (error) {
      console.log(
        "Error al escribir en el archivo de carritos:",
        error.message
      );
    }
  }

  generateId() {
    if (this.carts.length === 0) {
      return 1;
    }
    const lastCartId = this.carts[this.carts.length - 1].id;
    return lastCartId + 1;
  }

  getCarts() {
    return this.carts;
  }

  addCart() {
    const id = this.generateId();
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
  
}

export default CartManager;

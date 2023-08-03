import { Cart } from "../../models/cart.model.js";

class CartManager {
  //obtener carritos

  getCarts = async () => {
    try {
      const carts = await Cart.find();
      return carts;
    } catch (err) {
      console.error("Error al obtener los carritos:", err.message);
      return [];
    }
  };

  //obtener carrito por id

  getCartById = async (cartId) => {
    try {
      const cart = await Cart.findById(cartId);
      return cart;
    } catch (err) {
      console.error("Error al obtener el carrito por ID:", err.message);
      return err;
    }
  };

  //añadir producto al carrito

  addCart = async (products) => {
    try {
      let cartData = {};
      if (products && products.length > 0) {
        cartData.products = products;
      }

      const cart = await Cart.create(cartData);
      return cart;
    } catch (err) {
      console.error("Error al crear el carrito:", err.message);
      return err;
    }
  };

  //añadir producto al carrito seleccionado
  addProductInCart = async (cid, obj) => {
    try {
      const filter = { _id: cid, "products._id": obj._id };
      const cart = await Cart.findById(cid);
      const findProduct = cart.products.some(
        (product) => product._id.toString() === obj._id
      );

      if (findProduct) {
        const update = { $inc: { "products.$.quantity": obj.quantity } };
        await Cart.updateOne(filter, update);
      } else {
        const update = {
          $push: { products: { _id: obj._id, quantity: obj.quantity } },
        };
        await Cart.updateOne({ _id: cid }, update);
      }

      return await Cart.findById(cid);
    } catch (err) {
      console.error("Error al agregar el producto al carrito:", err.message);
      return err;
    }
  };
}

export default CartManager;

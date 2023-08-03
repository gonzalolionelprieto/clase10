// CartRouter.js

import { Router } from "express";
import CartManager from "../dao/mongoManagers/cart_mongo_manager.js";
import ProductManager from "../dao/mongoManagers/product_mongo_Manager.js";

const CartRouter = Router();
const cm = new CartManager();
const pm = new ProductManager();

// Ruta para crear un nuevo carrito
CartRouter.post("/", async (req, res) => {
  try {
    await cm.addCart(); // Espera a que se cree el carrito
    res.status(200).json({ message: "Carrito creado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener los carritos creados
CartRouter.get("/", async (req, res) => {
  try {
    const carts = await cm.getCarts(); // Espera a que se obtengan los carritos
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// carrito por id
CartRouter.get("/:cid", async (req, res) => {
  const cartofound = await cm.getCartById(req.params.cid); // Corregir aquí
  res.json({ status: "success", cartofound });
});

// Ruta para agregar un producto al carrito seleccionado sin redireccionar
CartRouter.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const checkIdProduct = await pm.getProductById(pid);
    if (!checkIdProduct) {
      return res
        .status(404)
        .send({ message: `Product with ID: ${pid} not found` });
    }

    let cart = await cm.getCartById(cid);
    if (!cart) {
      // Si el carrito no existe, lo creamos
      cart = await cm.addCart(cid);
    }

    const result = await cm.addProductInCart(cid, { _id: pid, quantity });
    console.log(result);

    // Respondemos con el carrito actualizado
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error occurred:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while processing the request" });
  }
});

export default CartRouter;

import { Router } from "express";
import CartManager from "../CartManager.js";
import ProductManager from "../ProductManager.js";

const CartRouter = Router();
const cartManager = new CartManager("./src/BD/carrito.json");
const productManager = new ProductManager("./src/BD/productos.json");

// Ruta para crear un nuevo carrito
CartRouter.post("/", (req, res) => {
  try {
    cartManager.addCart();
    res.status(200).json({ message: "Carrito creado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener los carritos creados
CartRouter.get("/", (req, res) => {
  try {
    const carts = cartManager.getCarts();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener los productos de un carrito específico
CartRouter.get("/:cid", (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const cart = cartManager.getCartById(cartId);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const products = cart.products;
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener los productos de un carrito específico
CartRouter.get("/:cid/products", (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const cart = cartManager.getCartById(cartId);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const products = cart.products;
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//endpoint agrega el producto seleccionado al carrito seleccionado

CartRouter.post("/:cid/product/:pid", (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  try {
    // Verificar si el carrito con el ID proporcionado existe
    const cart = cartManager.getCartById(cartId);

    // Verificar si el producto con el ID proporcionado existe
    const product = productManager.getProductById(productId);

    // Verificar si el producto ya existe en el carrito
    const existingProduct = cart.products.find((p) => p.id === productId);

    if (existingProduct) {
      // Si el producto existe, incrementar la cantidad en 1
      existingProduct.quantity += 1;
    } else {
      // Si el producto no existe, agregarlo al carrito con cantidad 1
      const newProduct = {
        id: productId,
        quantity: 1,
      };
      cart.products.push(newProduct);
    }

    // Guardar los cambios en el archivo de carritos
    cartManager.writeCarts();

    res.json({ message: "Producto agregado al carrito" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default CartRouter;

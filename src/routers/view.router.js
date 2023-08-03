import { Router } from "express";
import ProductManager from "../ProductManager.js";

const router = Router();
const pm = new ProductManager();

// Ruta para mostrar todos los productos en la vista "products.handlebars"

router.get("/products", async (req, res) => {
  try {
    const productsList = await pm.getLeanProducts();
    res.render("products", { productsList }); // Renderizar la vista "products.handlebars" con los productos
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los productos" });
    console.log(error);
  }
});



// Resto de las rutas del CRUD para los productos, si las tienes

export default router;



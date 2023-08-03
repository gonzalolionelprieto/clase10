import { Router } from "express";
import ProductManager from "../ProductManager.js";
import Products from "../models/product.model.js";

const router = Router();

const pm = new ProductManager();

// Ruta para mostrar todos los productos
router.get("/render", (req, res) => {
  try {
    const products = pm.getProducts();
    res.render("products", { products }); // Renderizar la vista "home.handlebars" con los productos
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para leer todos los productos con paginación , límite, categoria y disponibilidad




router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort || "asc";
  const category = req.query.category || null;
  const available =
    req.query.available === "true"
      ? true
      : req.query.available === "false"
      ? false
      : null;

  if (!Number.isInteger(page) || !Number.isInteger(limit)) {
    return res.status(400).json({
      message: "Los parámetros 'page' y 'limit' deben ser números enteros",
    });
  }

  if (sort !== "asc" && sort !== "desc") {
    return res.status(400).json({
      message:
        "El parámetro 'sort' debe ser 'asc' (ascendente) o 'desc' (descendente)",
    });
  }

  try {
    const pm = new ProductManager();
    const response = await pm.getProducts(req, {
      page,
      limit,
      sort,
      category,
      available,
    });

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
});





// Endpoint para obtener un solo producto por su ID
router.get("/:pid", async (req, res) => {
  const id = req.params.pid;

  try {
    console.log("ID del producto a consultar:", id);
    const product = await pm.getProductById(id);
    res.json({ product });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});



//endpoint para crear productos

router.post("/", (req, res) => {
  const { title, description, price, code, stock, category, thumbnails } =
    req.body;

  // Verificar si todos los campos obligatorios están presentes
  if (!title || !description || !price || !code || !stock || !category) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  // Crear un nuevo objeto de producto con los campos proporcionados
  const newProduct = {
    title,
    description,
    price,
    code,
    stock,
    category,
    thumbnails: thumbnails || [],
  };

  try {
    pm.addProduct(newProduct);
    res.status(201).json({ message: "Producto agregado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al agregar el producto" });
  }
});

// endpoint para actualizar un producto
router.put("/:pid", (req, res) => {
  const id = req.params.pid;
  const updatedProduct = req.body;

  try {
    if (updatedProduct.hasOwnProperty("id") && updatedProduct.id !== id) {
      return res
        .status(400)
        .json({ error: "No se permite actualizar el ID del producto" });
    }

    pm.updateProduct(id, updatedProduct);
    res.json({ message: `Producto con ID ${id} actualizado correctamente` });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});





// endpoint para eliminar un producto
router.delete("/:pid", (req, res) => {
  const id = req.params.pid; //obtenemos el id que le pasamos por url con el metodo params

  try {
    pm.deleteProduct(id);
    res.json({ message: `Producto con ID ${id} eliminado correctamente` });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router;

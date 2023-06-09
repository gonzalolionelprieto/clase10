import { Router } from "express";
import { ProductManager } from "../ProductManager.js";

const router = Router();

const pm = new ProductManager("./src/BD/productos.json");

// Endpoint para leer todos los productos
router.get("/", (req, res) => {
  const limit = req.query.limit;
  const products = pm.getProducts(); // Obtener los productos utilizando el método de ProductManager

  if (limit) {
    const limitedProducts = products.slice(0, limit);
    res.json(limitedProducts);
  } else {
    res.json(products);
  }
});

//endpoint para obtener un solo producto
router.get("/:pid", (req, res) => {
  const id = req.params.pid;

  try {
    const product = pm.getProductById(id);
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
  
    console.log("ID del producto:", id);
    console.log("Datos actualizados del producto:", updatedProduct);
  
    try {
      pm.updateProduct(id, updatedProduct);
      res.json({ message: `Producto con ID ${id} actualizado correctamente` });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });
  

// endpoint para eliminar un producto
router.delete("/:pid", (req, res) => {
  const id = req.params.pid;//obtenemos el id que le pasamos por url con el metodo params

  try {
    pm.deleteProduct(id);
    res.json({ message: `Producto con ID ${id} eliminado correctamente` });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router;

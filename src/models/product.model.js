import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"; // Asegúrate de haber instalado esta biblioteca

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: String,
    required: false, // Ahora el campo no es requerido
  },
  code: {
    type: String,
    unique: true, // Se asegura que el código sea único
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true, // Establecemos el valor por defecto en true
  },
});

// Agregar el plugin mongoosePaginate al esquema
productSchema.plugin(mongoosePaginate);

const Products = mongoose.model("Products", productSchema);

export default Products;

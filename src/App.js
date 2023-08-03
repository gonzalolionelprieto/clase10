import express from "express";
import http from "http";
import path from "path";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";

import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import viewsRouter from "./routers/view.router.js";

const app = express();
app.use(express.json());
const httpServer = http.createServer(app);
const io = new Server(httpServer);
const __dirname = path.resolve();

// Configurar el motor de plantillas Handlebars
app.engine("handlebars", handlebars.create({ defaultLayout: "main" }).engine);
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "handlebars");

// Configurar el servidor de socket.io
app.set("socketio", io);

// Rutas para la API de productos y carritos
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Rutas para las vistas
app.use("/", viewsRouter);

// Evento de conexión de Socket.IO
io.on("connection", (socket) => {
  console.log("Successful Connection");
  // Lógica para manejar eventos de socket
});

try {
  await mongoose.connect(
    "mongodb+srv://Gonza:3209@cluster0.ueiadmz.mongodb.net/eccomerce"
  );
  // Iniciar el servidor en el puerto 8080
  httpServer.listen(8080, () => console.log("Server up!"));
} catch (error) {
  console.log(error.message);
}

import express from "express";
import productRouter from "./routers/products.router.js";
import  CartRouter from "./routers/carts.router.js"

const app = express();
app.use(express.json());
// Endpoints
app.get("/", (req, res) => res.send("ok"));
app.get("/health", (req, res) => res.json({ message: "No bro te pasas gg" }));

app.use("/api/products", productRouter);
app.use("/api/carts", CartRouter)

app.listen(8080, () => console.log("Server Up!"));

import express from "express";
import productRouter from "./routers/products.router.js";
import cardsRouter from "./routers/cards.router.js";


const app = express();
app.use(express.json());
// Endpoints
app.get("/", (req, res) => res.send("ok"));
app.get("/health", (req, res) => res.json({ message: "No bro te pasas gg" }));

const middleware1 = (req, res, next) => {
  console.log("midle");
  next();
};




app.use("/api/products",productRouter);
app.use("/api/cards",cardsRouter)
app.listen(8080, () => console.log("Server Up!"));

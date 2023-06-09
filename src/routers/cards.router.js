import { Router } from "express";

const router = Router();
let cards=[]



//endpoint para leer todas las cards
router.get("/", (res) => {
    res.status(200).json({ cards });
  });



export default router;

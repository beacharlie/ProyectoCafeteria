import { Router } from 'express';
import { getProductos, createProducto } from '../controllers/product.controller';

const router = Router();

// Cuando alguien visite GET /api/productos -> Ejecuta getProductos
router.get('/', getProductos);

// Cuando alguien envíe datos a POST /api/productos -> Ejecuta createProducto
router.post('/', createProducto);

export default router;
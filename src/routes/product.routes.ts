import { Router } from 'express';
import { getProductos, createProducto, deleteProducto } from '../controllers/product.controller';

const router = Router();

// Cuando alguien visite GET /api/productos -> Ejecuta getProductos
router.get('/', getProductos);

// Cuando alguien envíe datos a POST /api/productos -> Ejecuta createProducto
router.post('/', createProducto);

// Cuando alguien envíe datos a DELETE /api/productos/del:id -> Ejecuta deleteProducto
router.delete('/:id', deleteProducto);

export default router;
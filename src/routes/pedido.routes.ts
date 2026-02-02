import { Router } from 'express';
import { createPedido, getPedidos} from '../controllers/pedido.controller';

const router = Router();

router.post('/', createPedido); // Crear pedido
router.get('/', getPedidos);    // Ver lista de pedidos


export default router;
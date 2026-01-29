import { Router } from 'express';
import { createPedido, getPedidos, updateEstadoPedido} from '../controllers/pedido.controller';

const router = Router();

router.post('/', createPedido); // Crear pedido
router.get('/', getPedidos);    // Ver lista de pedidos

router.patch('/:id', updateEstadoPedido);

export default router;
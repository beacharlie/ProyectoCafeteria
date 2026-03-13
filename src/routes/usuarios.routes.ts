import { Router } from 'express';
import { createUsuario, getUsuarios, login } from '../controllers/usuario.controller';

const router = Router();

router.post('/', createUsuario);
router.get('/users', getUsuarios);
router.post('/login', login);

export default router;
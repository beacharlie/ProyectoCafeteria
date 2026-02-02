import { Router } from 'express';
import { createUsuario, getUsuarios } from '../controllers/usuario.controller';

const router = Router();

router.post('/', createUsuario);
router.get('/users', getUsuarios);

export default router;
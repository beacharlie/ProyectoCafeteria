import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

export const createUsuario = async (req: Request, res: Response) => {
  try {
    const {
      nombreCompleto,
      email,
      password,
      codigoTutor,
      alergenos,
      horario // 1. Extraemos horario (es obligatorio en tu DB)
    } = req.body;

    const rol = req.body.rol ? String(req.body.rol).trim().toUpperCase() : 'CLIENTE';

    // Validación básica ampliada
    if (!email || !password || !nombreCompleto || !horario) {
      res.status(400).json({ error: 'Faltan campos obligatorios (nombre, email, password, horario).' });
      return;
    }

    if (rol === 'TUTOR') {
      const codigoMaestro = process.env.TUTOR_SECRET_CODE || 'CODIGO_TUTOR_TEST';
      if (codigoTutor !== codigoMaestro) {
        res.status(403).json({ error: 'Código de tutor inválido.' });
        return;
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const alergenosString = Array.isArray(alergenos)
      ? alergenos.join(', ').substring(0, 100)
      : (alergenos || "");

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombreCompleto,
        email,
        password: hashedPassword,
        rol: rol,
        codigoTutor: rol === 'TUTOR' ? codigoTutor : null,
        horario: horario,
        alergenos: alergenosString
      }
    });

    const { password: _, ...usuarioSinPassword } = nuevoUsuario;
    return res.status(201).json(usuarioSinPassword);

  } catch (error: any) {
    console.error("Error detallado:", error);
    if (error.code === 'P2002') {
    return  res.status(400).json({ error: 'El email ya está registrado.' });
    } else {
    return  res.status(500).json({ error: 'Error al crear usuario', details: error.message });
    }
  }
};

export const getUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (usuario) {
      const passwordMatch = await bcrypt.compare(password, usuario.password);
      if (passwordMatch) {
        res.status(200).send('Bienvenido');
      } else {
        res.status(401).json({ error: 'Credenciales inválidas' })
      }
    } else {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

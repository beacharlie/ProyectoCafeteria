import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const createUsuario = async (req: Request, res: Response) => {
  try {
    const { nombreCompleto, email, password, rol, codigoTutor } = req.body;

    // VALIDACIÓN: Si es tutor, exigimos el código
    if (rol === 'TUTOR' && !codigoTutor) {
      res.status(400).json({ 
        error: 'El código de tutor es obligatorio para el rol TUTOR.' 
      });
      return;
    }

    // Si no es tutor, nos aseguramos de que no se guarde basura (opcional, pero limpio)
    const codigoFinal = rol === 'TUTOR' ? codigoTutor : null;

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombreCompleto,
        email,
        password, // Nota: En una app real, aquí deberías hashear la contraseña (ej: bcrypt)
        rol: rol || 'CLIENTE',
        codigoTutor: codigoFinal
      }
    });

    res.status(201).json(nuevoUsuario);
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'El email ya está registrado' });
    } else {
      res.status(500).json({ error: 'Error al crear usuario', details: error.message });
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
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma'; // Importamos tu cliente de Prisma

// Función para obtener todos los productos
export const getProductos = async (req: Request, res: Response) => {
  try {
    const productos = await prisma.producto.findMany({
      include: {
        categoria: true // ¡Truco! Esto trae también el nombre de la categoría
      }
    });
    
    // Respondemos con JSON
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// Función para crear un producto nuevo
export const createProducto = async (req: Request, res: Response) => {
  try {
    // Extraemos los datos del cuerpo de la petición (body)
    const { nombre, precio, stock, categoriaId } = req.body;

    const nuevoProducto = await prisma.producto.create({
      data: {
        nombre,
        precio,
        stock,
        categoriaId: Number(categoriaId) // Aseguramos que sea número
      }
    });

    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear producto' });
  }
};
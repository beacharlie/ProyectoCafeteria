import { Request, Response } from 'express';
import { prisma } from '../lib/prisma'; // Importamos tu cliente de Prisma

// Función para obtener todos los productos
export const getProductos = async (req: Request, res: Response) => {
  try {
    const productos = await prisma.producto.findMany({
      include: {
        categoria: true // Debe coincidir con el nombre en schema.prisma (plural)
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
    const { nombre, precio, categoriaId, alergenos } = req.body;

    const nuevoProducto = await prisma.producto.create({
      data: {
        nombre,
        precio,
        alergenos,
        categoriaId: Number(categoriaId) // Aseguramos que sea número
      }
    });

    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear producto' });
  }
};

export const deleteProducto = async (req: Request, res: Response) => {  
  try {
    const { id } = req.params;
    const productoEliminado = await prisma.producto.delete({
      where: {
        id: Number(id)
      }
    });
    res.json(productoEliminado);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: 'No se pudo eliminar el producto', details: error.message });
  }
};
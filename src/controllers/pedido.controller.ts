import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const createPedido = async (req: Request, res: Response) => {
  try {
    const { usuarioId, items } = req.body; 
    // items espera ser un array así: [{ productoId: 1, cantidad: 2 }]
    
    if (!items || !Array.isArray(items)) {
      res.status(400).json({ error: 'El campo "items" es requerido y debe ser un array' });
      return;
    }

    // 1. Buscamos los productos en la BBDD para obtener los precios reales
    const productosIds = items.map((item: any) => Number(item.productoId));
    const productosDb = await prisma.producto.findMany({
      where: { id: { in: productosIds } }
    });

    // 2. Calculamos el total y preparamos los detalles
    let totalCalculado = 0;
    const detallesData = [];

    for (const item of items) {
      const producto = productosDb.find(p => p.id === Number(item.productoId));
      if (!producto) {
        res.status(400).json({ error: `Producto con ID ${item.productoId} no encontrado` });
        return;
      }
      
      const precioReal = Number(producto.precio);
      const cantidad = Number(item.cantidad);
      totalCalculado += precioReal * cantidad;

      detallesData.push({
        productoId: producto.id,
        cantidad: cantidad,
        precioUnitario: precioReal
      });
    }

    // 3. Insertamos TODO en una sola transacción (Cabecera + Detalles)
    const nuevoPedido = await prisma.pedido.create({
      data: {
        usuarioId: Number(usuarioId), // Aseguramos que sea número
        total: totalCalculado,
        // ¡Aquí está la magia de Prisma! Creamos los renglones al mismo tiempo
        detalles: {
          create: detallesData
        }
      },
      include: {
        detalles: true // Para que la respuesta incluya los detalles creados
      }
    });

    res.status(201).json(nuevoPedido);
  } catch (error: any) {
    console.error(error);
    // Enviamos el mensaje de error real para saber qué falló (ej: Foreign key constraint failed)
    res.status(400).json({ error: 'No se pudo crear el pedido', details: error.message });
  }
};

// Función para ver los pedidos de la cafetería
export const getPedidos = async (req: Request, res: Response) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: {
        usuario: { select: { nombreCompleto: true } }, // Ver quién pidió
        detalles: {
          include: { producto: true } // Ver qué productos son
        }
      },
      orderBy: {
        fechaPedido: 'desc' // Los más nuevos primero
      }
    });
    res.json(pedidos);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener pedidos', details: error.message });
  }
};
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const createPedido = async (req: Request, res: Response) => {
  try {
    const { usuarioId, items } = req.body; 
    // items espera ser un array así: [{ productoId: 1, cantidad: 2, precio: 4.50 }]
    
    if (!items || !Array.isArray(items)) {
      res.status(400).json({ error: 'El campo "items" es requerido y debe ser un array' });
      return;
    }

    // 1. Calculamos el total sumando los subtotales
    const totalCalculado = items.reduce((acc: number, item: any) => {
      return acc + (Number(item.precio) * Number(item.cantidad));
    }, 0);

    // 2. Insertamos TODO en una sola transacción (Cabecera + Detalles)
    const nuevoPedido = await prisma.pedido.create({
      data: {
        usuarioId: Number(usuarioId), // Aseguramos que sea número
        total: totalCalculado,
        estado: 'PENDIENTE',
        // ¡Aquí está la magia de Prisma! Creamos los renglones al mismo tiempo
        detalles: {
          create: items.map((item: any) => ({
            productoId: Number(item.productoId),
            cantidad: Number(item.cantidad),
            precioUnitario: Number(item.precio)
          }))
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

// ... (tus imports y funciones anteriores)

// Función para que el Barista cambie el estado (ej: de PENDIENTE a LISTO)
export const updateEstadoPedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;   // El ID viene en la URL (ej: /api/pedidos/5)
    const { estado } = req.body; // El nuevo estado viene en el body

    const pedidoActualizado = await prisma.pedido.update({
      where: {
        id: Number(id) // Convertimos el texto de la URL a número
      },
      data: {
        estado: estado // Actualizamos solo el campo estado
      }
    });

    res.json(pedidoActualizado);
  } catch (error) {
    res.status(400).json({ error: 'No se pudo actualizar el pedido' });
  }
};
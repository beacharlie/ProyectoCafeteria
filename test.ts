// test.ts
import { prisma } from './src/lib/prisma';

async function main() {
  // 1. Intentamos leer las categorías
  const categorias = await prisma.categoria.findMany({
    include: {
      productos: true // ¡Trae también los productos de esa categoría!
    }
  });

  console.log('--- MIS CATEGORÍAS ---');
  console.dir(categorias, { depth: null });
  
  // 2. Intentamos leer usuarios
  const usuarios = await prisma.usuario.findMany();
  console.log('--- MIS USUARIOS ---');
  console.log(usuarios);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
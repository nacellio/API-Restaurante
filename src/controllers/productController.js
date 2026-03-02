import prisma from "../db.js";

function parsePrice(price) {
  const parsed = Number(price);
  return Number.isFinite(parsed) ? parsed : null;
}

async function listProducts(req, res, next) {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return res.json(products);
  } catch (error) {
    return next(error);
  }
}

async function getProductById(req, res, next) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: true },
    });

    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    return res.json(product);
  } catch (error) {
    return next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const { name, description, price, categoryId } = req.body;
    const parsedPrice = parsePrice(price);

    if (!name || parsedPrice === null) {
      return res.status(400).json({ message: "name e price são obrigatórios" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price: parsedPrice,
        imageUrl,
        categoryId: categoryId || null,
      },
    });

    return res.status(201).json(product);
  } catch (error) {
    return next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description, price, categoryId, imageUrl } = req.body;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (categoryId !== undefined) updateData.categoryId = categoryId || null;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (price !== undefined) {
      const parsedPrice = parsePrice(price);
      if (parsedPrice === null) {
        return res.status(400).json({ message: "price inválido" });
      }
      updateData.price = parsedPrice;
    }

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await prisma.product.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    await prisma.product.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

export {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

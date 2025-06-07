import prisma from '../prisma';

export const cartCrud = {
  async addItem(userId: number, productId: number, quantity: number) {
    return await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      update: {
        quantity: { increment: quantity },
        updatedAt: new Date(),
      },
      create: {
        userId,
        productId,
        quantity,
      },
      include: { product: true },
    });
  },

  async getByUserId(userId: number) {
    return await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: { category: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async updateQuantity(userId: number, productId: number, quantity: number) {
    return await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      data: {
        quantity,
        updatedAt: new Date(),
      },
    });
  },

  async removeItem(userId: number, productId: number) {
    return await prisma.cartItem.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  },

  async clearCart(userId: number) {
    return await prisma.cartItem.deleteMany({
      where: { userId },
    });
  },

  async getCartTotal(userId: number) {
    const items = await this.getByUserId(userId);
    return items.reduce((total, item) => {
      return total + item.quantity * (item.product?.price.toNumber() || 0);
    }, 0);
  },
};

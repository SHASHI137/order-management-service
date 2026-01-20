import { Router } from 'express';
import prisma from '../db';
import { z } from 'zod';

const router = Router();

const placeOrderSchema = z.object({
    items: z.array(z.object({
        productId: z.number().int(),
        quantity: z.number().int().positive(),
    })).min(1),
    idempotencyKey: z.string().optional(),
});

// Place Order (Atomic & Concurrent Safe)
router.post('/', async (req, res) => {
    try {
        const { items, idempotencyKey } = placeOrderSchema.parse(req.body);

        if (idempotencyKey) {
            const existingOrder = await prisma.order.findUnique({ where: { idempotencyKey } });
            if (existingOrder) {
                res.json(existingOrder);
                return;
            }
        }

        // Transaction: Place order and decrement stock safely
        const order = await prisma.$transaction(async (tx) => {
            let totalAmount = 0;
            const orderItemsData = [];

            for (const item of items) {
                // 1. Check stock with "FOR UPDATE" logic (Prisma doesn't natively support SELECT FOR UPDATE across DBs easily, 
                // using optimistic locking or raw decrement check is cleaner for this assignment)

                // Approach: Decrement directly and check if row updated.
                // Update Product SET stock = stock - qty WHERE id = ? AND stock >= qty
                const updatedProduct = await tx.product.updateMany({
                    where: {
                        id: item.productId,
                        stock: {
                            gte: item.quantity
                        }
                    },
                    data: {
                        stock: {
                            decrement: item.quantity
                        }
                    }
                });

                if (updatedProduct.count === 0) {
                    throw new Error(`Insufficient stock for product ID ${item.productId}`);
                }

                // Fetch price for record keeping
                const product = await tx.product.findUnique({ where: { id: item.productId } });
                if (!product) throw new Error('Product not found'); // Should catch above, but safety

                totalAmount += product.price * item.quantity;
                orderItemsData.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: product.price
                });
            }

            // Create Order
            const newOrder = await tx.order.create({
                data: {
                    totalAmount,
                    status: 'CREATED',
                    idempotencyKey,
                    items: {
                        create: orderItemsData
                    }
                },
                include: { items: true }
            });

            return newOrder;
        });

        res.json(order);

    } catch (error: any) {
        res.status(400).json({ error: error.message || 'Transaction failed' });
    }
});

// Order History
router.get('/', async (req, res) => {
    const orders = await prisma.order.findMany({
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
});

export default router;

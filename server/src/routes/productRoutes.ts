import { Router } from 'express';
import prisma from '../db';
import { z } from 'zod';

const router = Router();

// Validation
const createProductSchema = z.object({
    name: z.string().min(1),
    price: z.number().positive(),
    stock: z.number().int().nonnegative(),
});

// Create Product
router.post('/', async (req, res) => {
    try {
        const data = createProductSchema.parse(req.body);
        const product = await prisma.product.create({
            data,
        });
        res.json(product);
    } catch (error) {
        res.status(400).json({ error: 'Invalid input' });
    }
});

// Get Products
router.get('/', async (req, res) => {
    const products = await prisma.product.findMany();
    res.json(products);
});

// Get Inventory
router.get('/:id/inventory', async (req, res) => {
    const id = parseInt(req.params.id);
    const product = await prisma.product.findUnique({
        where: { id },
        select: { stock: true, id: true, name: true }
    });

    if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
    }

    res.json(product);
});

export default router;

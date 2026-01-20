import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.get('/', (req, res) => {
    res.send('Product Order System API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

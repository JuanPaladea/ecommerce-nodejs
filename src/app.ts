import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import apiProductsRouter from './routes/apiProducts.router';
import apiUsersRouter from './routes/apiUsers.router';
import apiCartsRouter from './routes/apiCarts.router';
import apiOrdersRouter from './routes/apiOrders.router';

const app = express();

app.use(cors())
app.use(helmet())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/products', apiProductsRouter)
app.use('/api/users', apiUsersRouter)
app.use('/api/carts', apiCartsRouter)
app.use('/api/orders', apiOrdersRouter)

export default app;
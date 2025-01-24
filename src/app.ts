import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import apiProductsRouter from './routes/apiProducts.router';
import apiUsersRouter from './routes/apiUsers.router';
import apiCartsRouter from './routes/apiCarts.router';
import apiOrdersRouter from './routes/apiOrders.router';
import apiPaymentsRouter from './routes/apiPayments.router';
import { swaggerOptions } from './utils/swagger';

export const app = express();

app.use(cors())
app.use(helmet())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const swaggerSpec = swaggerJSDoc(swaggerOptions)
app.get('/', (req, res) => {res.redirect('/docs')})

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/api/products', apiProductsRouter)
app.use('/api/users', apiUsersRouter)
app.use('/api/carts', apiCartsRouter)
app.use('/api/orders', apiOrdersRouter)
app.use('/api/payments', apiPaymentsRouter)

export default app;
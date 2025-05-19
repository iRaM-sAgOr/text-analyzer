import express, { Application } from 'express';
import { connectDB } from './config/database';
import { errorHandler } from './middelware/error.middleware';
import textRoutes from './api/routes/text.route';
import { apiLimiter } from './api/middleware/throttle.middleware';

export const createApp = async (): Promise<Application> => {
    const app = express();

    await connectDB();

    app.use(express.json());

    app.use('/api/texts', apiLimiter, textRoutes);

    app.use(errorHandler)

    return app;
}
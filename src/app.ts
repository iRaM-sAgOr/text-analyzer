import express, { Application } from 'express';
import cors, { CorsOptions } from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { connectDB } from './config/database';
import { errorHandler } from './middelware/error.middleware';
import textRoutes from './api/routes/text.route';
import { apiLimiter } from './api/middleware/throttle.middleware';
import morganMiddleware from './middelware/httplog.middleware';

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Text Analyzer API",
            version: "1.0.0",
            description: "API for analyzing text data",
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3001}`,
            },
        ],
    },
    apis: ["./src/api/routes/*.ts", "./dist/api/routes/*.js"],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);

export const createApp = async (): Promise<Application> => {
    const app = express();

    const corsOptions: CorsOptions = {
        origin: "*",
    };

    app.use("/analyzer/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

    app.use(morganMiddleware);
    app.use(cors(corsOptions));

    await connectDB();

    app.use(express.json());

    app.use('/api/texts', apiLimiter, textRoutes);

    app.use(errorHandler)

    return app;
}
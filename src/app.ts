import express, { Application } from 'express';

export const createApp = async (): Promise<Application> => {
    const app = express();
    app.use(express.json());
    return app;
}
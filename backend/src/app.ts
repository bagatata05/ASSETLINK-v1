import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import assetRoutes from './routes/assetRoutes';
import repairRoutes from './routes/repairRoutes';
import photoRoutes from './routes/photoRoutes';
import authRoutes from './routes/authRoutes';
import maintenanceTaskRoutes from './routes/maintenanceTaskRoutes';
import schoolRoutes from './routes/schoolRoutes';
import userRoutes from './routes/userRoutes';
import { config } from './config/unifiedConfig';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date(), env: config.server.env });
});

app.get('/api/v1', (req, res) => {
    res.json({
        name: 'AssetLink API',
        version: '1.0.0',
        resources: [
            '/api/v1/assets',
            '/api/v1/repairs',
            '/api/v1/photos',
            '/api/v1/auth',
            '/api/v1/maintenance-tasks',
            '/api/v1/schools',
            '/api/v1/users'
        ]
    });
});

app.use('/api/v1/assets', assetRoutes);
app.use('/api/v1/repairs', repairRoutes);
app.use('/api/v1/photos', photoRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/maintenance-tasks', maintenanceTaskRoutes);
app.use('/api/v1/schools', schoolRoutes);
app.use('/api/v1/users', userRoutes);

// Error Handling Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('[GlobalErrorHandler]', err);
    
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    const code = err.code || 'INTERNAL_ERROR';

    res.status(status).json({
        success: false,
        error: message,
        code,
        status,
        ...(config.server.env === 'development' && { stack: err.stack })
    });
});

export default app;

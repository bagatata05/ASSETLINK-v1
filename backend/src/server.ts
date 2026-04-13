import app from './app';
import { config } from './config/unifiedConfig';

const PORT = config.server.port;

const server = app.listen(PORT, () => {
    console.log(`🚀 AssetLink Backend running on port ${PORT} in ${config.server.env} mode`);
    console.log(`🔗 API Base: http://localhost:${PORT}/api/v1`);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection! Shutting down...', err);
    server.close(() => {
        process.exit(1);
    });
});

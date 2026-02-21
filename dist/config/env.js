import dotenv from 'dotenv';
dotenv.config();
export const config = {
    port: parseInt(process.env.PORT || '3002', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    databaseUrl: process.env.DATABASE_URL || '',
    jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
    encryptionKey: process.env.ENCRYPTION_KEY || '',
};
if (!config.databaseUrl) {
    throw new Error('DATABASE_URL is required');
}
if (!config.jwtSecret || config.jwtSecret === 'change-me-in-production') {
    console.warn('⚠️  WARNING: Using default JWT_SECRET. Set a secure secret in production!');
}
//# sourceMappingURL=env.js.map
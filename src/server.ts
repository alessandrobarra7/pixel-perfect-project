import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import unitsRoutes from './routes/units.js';
import studiesRoutes from './routes/studies.js';
import reportsRoutes from './routes/reports.js';
import templatesRoutes from './routes/templates.js';
import auditRoutes from './routes/audit.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';

const app = express();

app.set('trust proxy', true);

app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/units', unitsRoutes);
app.use('/api/studies', studiesRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/templates', templatesRoutes);
app.use('/api/audit', auditRoutes);

app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`🚀 PACS-MANUS Backend running on port ${PORT}`);
  logger.info(`Environment: ${config.nodeEnv}`);
});

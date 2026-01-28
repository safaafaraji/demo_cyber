const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { cors: corsConfig } = require('./config/security.config');
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandler.middleware');
const rateLimiter = require('./middlewares/rateLimiter.middleware');
const loggerMiddleware = require('./middlewares/logger.middleware');

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors(corsConfig));
app.use(rateLimiter);

// Optimization
app.use(compression());

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(loggerMiddleware);

// Static files
app.use('/public', express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/v1', router);

// Health check root
app.get('/', (req, res) => {
    res.send('Cyber Range Backend API v1.0.0');
});

// Error handling
app.use(errorHandler);

module.exports = app;

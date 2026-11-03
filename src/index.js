import express from 'express';
import cors from 'cors';
import { PORT } from './config/serverconfig.js';
import passport from 'passport';

import { connect } from './config/database.js';

import { passportAuth } from './config/jwt-middleware.js';

import apiRoutes from './routes/index.js';

const app = express();

// Build allowed-origins list from env (comma-separated) + always allow localhost dev origins
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
];

if (process.env.FRONTEND_URL) {
    process.env.FRONTEND_URL.split(',').forEach((url) => {
        const trimmed = url.trim();
        if (trimmed && !allowedOrigins.includes(trimmed)) {
            allowedOrigins.push(trimmed);
        }
    });
}

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow server-to-server requests (no origin) and listed origins
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error(`CORS: origin '${origin}' not allowed`));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
passportAuth(passport);

app.use('/api', apiRoutes);

// Health-check endpoint (used by cloud platforms like Railway, Render, etc.)
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.listen(PORT, async () => {
    console.log(`Server Started Successfully on ${PORT}`);
    await connect();
    console.log("Mongo Db connected");
});

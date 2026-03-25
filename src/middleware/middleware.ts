// Body parser
import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
    //origin: process.env.NODE_ENV === 'production'
    //    ? ['https://pohonku.app']
    //    : '*',
    credentials: true,
    origin: process.env.FRONTEND_URL || 'https://pohonku-testing.vercel.app', // URL frontend
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));

export default app;
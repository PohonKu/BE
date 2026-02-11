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
    origin: 'http://localhost:3000', // URL frontend
    methods: ['GET', 'POST'],
}));

export default app;
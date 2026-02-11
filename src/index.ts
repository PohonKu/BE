import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './prisma/prisma';
import middlewareApp from './middleware/middleware';
import treeRoutes from './routes/tree.routes';
//import testApp from './testDb/test';
//import userApp from './controllers/user.controller';
//import adoptionApp from './controllers/adoption.controller';
//import orderItemApp from './controllers/orderItem.controller';
//import orderApp from './controllers/order.controller';
//import treeApp from './controllers/tree.controller';
//import treeSpeciesApp from './controllers/treeSpecies.controler';
//import treeUpdateApp from './controllers/treeUpdate.controller';

dotenv.config();

const PORT = process.env.PORT;
const app = express();

// ============ MIDDLEWARE ============
app.use(middlewareApp);

app.use("/api/v1/trees", treeRoutes);




// ============ START SERVER ============

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export default app;

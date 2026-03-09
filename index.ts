import dotenv from 'dotenv'
dotenv.config()
import express from 'express';
const app = express();
import cors from 'cors';
app.use(cors({
    origin: process.env.CLI_URL,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    // allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));


import http from 'http';
import connectDB from './src/third-party/mongodb/connect';
import { router } from './src/views/router.views';
import { createClient } from 'redis'
import { connectRedis, storeRedis } from './src/third-party/redis/redis';
import { initSocket } from './src/third-party/socket/socket';
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();
<<<<<<< HEAD
connectRedis();
=======
// connectRedis();
>>>>>>> 5f7a284a274c2f7e9d606ac6e5c621b02a12492c
router(app);
initSocket(server)

server.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
})

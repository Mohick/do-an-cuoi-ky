import dotenv from 'dotenv'
dotenv.config()
require('./src/third-party/upload-images/multer')
import express from 'express';
const app = express();
import cors from 'cors';
import http from 'http';
import connectDB from './src/third-party/mongodb/connect';
import { router } from './src/views/router.views';
import { createClient } from 'redis'
import { connectRedis, storeRedis } from './src/third-party/redis/redis';
import { initSocket } from './src/third-party/socket/socket';

const allowedOrigins = [
  process.env.CLI_URL,
  process.env.CLIENT_URL,
  process.env.PROD_CLIENT_URL,
].filter(Boolean);


const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error(`CORS policy: origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();
connectRedis();
router(app);
initSocket(server,)

server.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
})

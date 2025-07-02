import express from 'express';
import cors from 'cors';
import CookieParser from 'cookie-parser';
const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,


}));
app.use(express.json({limit: '50kb'}));
app.use(CookieParser());
app.use(express.urlencoded({limit: '50kb', extended: true}));
app.use(express.static('public'));


export default app;

// export { app }
import express from 'express';
import cors from 'cors';
import CookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json({limit: '50kb'}));
app.use(CookieParser());
app.use(express.urlencoded({limit: '50kb', extended: true}));
app.use(express.static('public'));



// testing
app.get('/api/v1/test', (req, res) => {
  res.status(200).json({ message: 'Test route works!' });
});
// Root route
app.get('/', (req, res) => {
  res.status(200).send({ message: 'Welcome to the API and this is GET' });
});



// Importing routes
import userRoutes from './routes/user.routes.js';


// Using routes
app.use("/api/v1/users", userRoutes);

export default app;

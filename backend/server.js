import express from "express";
import api from './routes/index.js';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import cors from "cors";
import Getloginapp from './routes/loginrouter.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_PATH, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(e => console.log(e));

const PORT = process.env.SERVER_PORT || 9000;
const origin = process.env.CORS_ORIGIN || 'http://localhost:3000';

const app = express();

app.use(cors({
    origin
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define your routes before the listen method
app.use('/api', api);
app.use('/login', Getloginapp);

app.get('/testing', (req, res) => {
    res.send('hello world');
});

// Catch-all route to handle undefined routes
app.use((req, res) => {
    res.status(404).send('Route not found');
});

app.listen(PORT, () => {
    console.log(`Your app is running at http://localhost:${PORT}`);
});

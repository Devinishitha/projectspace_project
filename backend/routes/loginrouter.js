import express from 'express';
import CheckLogin from '../controllers/Logincontroler.js';

const Router = express.Router();

Router.post('/getlogins', CheckLogin);

export default Router;

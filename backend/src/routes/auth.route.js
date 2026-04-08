const express = require('express');
const authRouter = express.Router();
const { register, login, logout, getMe } = require('../controllers/auth.controller');
const authmiddleware = require('../middlewares/auth.middleware');

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', authmiddleware, logout);
authRouter.get('/getme', authmiddleware, getMe);

module.exports = authRouter;
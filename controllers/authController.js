const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');
const User = require('../models/userModel');

const generateAccessToken = (user) => {
    return jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: config.jwtExpiration });
};

const generateRefreshToken = (user) => {
    const refreshToken = jwt.sign(
        { userId: user.id }, 
        config.jwtRefreshSecret,
        { expiresIn: config.jwtRefreshExpiration } 
    );
    User.addRefreshToken(refreshToken, user.id); 
    return refreshToken;
};

exports.register = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const userExists = User.findUserByUsername(username);
    if (userExists) {
        return res.status(409).json({ message: 'Username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: uuidv4(), username: username, password: hashedPassword };
    User.addUser(newUser);

    res.status(201).json({ message: 'User registered successfully.' });
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    const user = User.findUserByUsername(username);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({ accessToken: accessToken, refreshToken: refreshToken });
};

exports.token = (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken || !User.findRefreshToken(refreshToken)) {
        return res.sendStatus(401);
    }

    jwt.verify(refreshToken, config.jwtRefreshSecret, (err, decoded) => {
        if (err) return res.sendStatus(403);

        const refreshTokenData = User.findRefreshToken(refreshToken);
        const user = User.findUserById(refreshTokenData.userId);

        if (!user) {
            return res.sendStatus(404); 
        }

        const newAccessToken = generateAccessToken(user);
        res.json({ accessToken: newAccessToken });
    });
};

exports.logout = (req, res) => {
    const { refreshToken } = req.body;

    if (refreshToken && User.findRefreshToken(refreshToken)) {
        User.deleteRefreshToken(refreshToken);
        return res.sendStatus(204);
    }

    res.sendStatus(204);
};
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/token', authController.token);
router.delete('/logout', authController.logout);
router.get('/protected', authMiddleware.authenticateToken, (req, res) => {
    res.json({ message: `This is a protected resource for user ID: ${req.user.userId}` });
});

module.exports = router;
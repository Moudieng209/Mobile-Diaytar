const { verifyToken } = require('../utils/jwt');
const redisClient = require('../config/redis');

const authMiddleware = async (req, res, next) => {
    const header = req.headers['authorization'];

    if (!header) {
        return res.status(401).json({ message: 'Token manquant' });
    }

    const token = header.startsWith('Bearer ')
        ? header.split(' ')[1]
        : header;

    try {
        verifyToken(token);

        const session = await redisClient.get(token);

        if (!session) {
            return res.status(401).json({ message: 'Session expirée' });
        }

        req.user = JSON.parse(session);
        next();

    } catch (err) {
        return res.status(401).json({ message: 'Token invalide' });
    }
};

module.exports = authMiddleware;

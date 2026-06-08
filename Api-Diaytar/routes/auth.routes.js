const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { upload, updatePhoto } = require('../controllers/auth.controller');

router.post('/inscription', authController.inscription);
router.post('/connexion', authController.connexion);
router.post('/deconnexion', authMiddleware, authController.deconnexion);

router.get('/profile', authMiddleware, authController.getProfile);
router.put('/photo', authMiddleware, upload.single('photo'), updatePhoto);
router.put('/profile', authMiddleware, authController.updateProfile);
router.post('/fcm-token', authMiddleware, authController.saveFcmToken);
module.exports = router;

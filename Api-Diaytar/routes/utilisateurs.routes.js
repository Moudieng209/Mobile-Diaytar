const express = require('express');
const router = express.Router();
const utilisateursController = require('../controllers/UtilisateursController');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

router.use(authMiddleware, adminMiddleware);

router.get('/', utilisateursController.getAllUtilisateurs);
router.get('/:id', utilisateursController.getUtilisateurById);
router.patch('/:id/role', utilisateursController.updateRole);
router.delete('/:id', utilisateursController.deleteUtilisateur);

module.exports = router;
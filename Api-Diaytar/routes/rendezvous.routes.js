
const express = require('express');
const router = express.Router();

const rendezVousController = require('../controllers/RendezvousController');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

router.use(authMiddleware);

router.get('/all', adminMiddleware, rendezVousController.getAllRendezVous);

router.post('/', rendezVousController.createRendezVous);
router.get('/', rendezVousController.getMyRendezVous);
router.get('/:id', rendezVousController.getRendezVousById);
router.put('/:id', rendezVousController.updateRendezVous);

router.patch('/:id/annuler',   rendezVousController.annulerRendezVous);
router.patch('/:id/terminer',  rendezVousController.terminerRendezVous);
router.patch('/:id/confirmer', rendezVousController.confirmerRendezVous);
router.patch('/:id/statut',    rendezVousController.updateStatut);

module.exports = router;
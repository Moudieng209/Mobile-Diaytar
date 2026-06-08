const express = require('express');
const router = express.Router();

const serviceController = require('../controllers/ServiceController');
const authMiddleware = require('../middlewares/auth.middleware');


router.get('/', serviceController.getAllServices);

router.get('/:id', serviceController.getServiceById);

router.post('/', authMiddleware, serviceController.createService);
router.put('/:id', authMiddleware, serviceController.updateService);
router.delete('/:id', authMiddleware, serviceController.deleteService);

module.exports = router;

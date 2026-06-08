const Service = require('../models/Service');

exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.findAll({
            where: { isActive: true },
            order: [['nom', 'ASC']]
        });
        res.json(services);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des services" });
    }
};

exports.getServiceById = async (req, res) => {
    try {
        const service = await Service.findByPk(req.params.id);
        if (!service) {
            return res.status(404).json({ message: "Service non trouvé" });
        }
        res.json(service);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération du service" });
    }
};

exports.createService = async (req, res) => {
    try {
        const { nom, description, prix, duree } = req.body;

        const service = await Service.create({
            nom,
            description,
            prix,
            duree,
            isActive: true
        });

        res.status(201).json({
            message: "Service créé avec succès",
            service
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la création du service" });
    }
};

exports.updateService = async (req, res) => {
    try {
        const service = await Service.findByPk(req.params.id);
        if (!service) {
            return res.status(404).json({ message: "Service non trouvé" });
        }

        await service.update(req.body);
        res.json({ message: "Service mis à jour", service });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
};

exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findByPk(req.params.id);
        if (!service) {
            return res.status(404).json({ message: "Service non trouvé" });
        }

        await service.destroy();
        res.json({ message: "Service supprimé avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la suppression" });
    }
};

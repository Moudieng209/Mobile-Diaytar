const RendezVous = require('../models/RendezVous');
const Service = require('../models/Service');
const Utilisateur = require('../models/utilisateurs'); 
const admin = require('../utils/firebaseAdmin');

// ADMIN : TOUS LES RDV 
exports.getAllRendezVous = async (req, res) => {   
    try {
        const rendezVous = await RendezVous.findAll({
            include: [
                { model: Service,     attributes: ['nom', 'prix', 'duree'] },
                { model: Utilisateur, attributes: ['id', 'prenom', 'nom', 'email', 'telephone'] },
            ],
            order: [['date', 'DESC'], ['heure', 'ASC']],
        });
        res.json(rendezVous);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération' });
    }
};

// CRÉER 
exports.createRendezVous = async (req, res) => {
    try {
        const { serviceId, date, heure, notes } = req.body;

        const service = await Service.findOne({
            where: { id: serviceId, isActive: true }
        });

        if (!service) {
            return res.status(400).json({ message: "Service invalide ou non disponible" });
        }

        const rendezVous = await RendezVous.create({
            utilisateurId: req.user.id,
            serviceId,
            date,
            heure,
            notes,
            statut: 'en_attente'
        });

        res.status(201).json({
            message: "Rendez-vous créé avec succès",
            rendezVous
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la création du rendez-vous" });
    }
};

// MES RDV (client) 
exports.getMyRendezVous = async (req, res) => {
    try {
        const rendezVous = await RendezVous.findAll({
            where: { utilisateurId: req.user.id },
            include: [{
                model: Service,
                attributes: ['nom', 'prix', 'duree']
            }],
            order: [['date', 'ASC'], ['heure', 'ASC']]
        });

        res.json(rendezVous);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des rendez-vous" });
    }
};

// UN RDV PAR ID 
exports.getRendezVousById = async (req, res) => {
    try {
        const rendezVous = await RendezVous.findOne({
            where: { 
                id: req.params.id,
                utilisateurId: req.user.id 
            },
            include: [Service]
        });

        if (!rendezVous) {
            return res.status(404).json({ message: "Rendez-vous non trouvé" });
        }

        res.json(rendezVous);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération" });
    }
};

// ANNULER 
exports.annulerRendezVous = async (req, res) => {
  try {
    const rendezVous = await RendezVous.findByPk(req.params.id, {
      include: [{ model: Utilisateur, attributes: ['fcmToken', 'prenom'] }]
    });

    if (!rendezVous) return res.status(404).json({ message: "Rendez-vous non trouvé" });

    await rendezVous.update({ statut: 'annulé' });

    const fcmToken = rendezVous.Utilisateur?.fcmToken;
    if (fcmToken) {
      await admin.messaging().send({
        token: fcmToken,
        notification: {
          title: '❌ Rendez-vous annulé',
          body: `Bonjour ${rendezVous.Utilisateur.prenom}, votre rendez-vous du ${rendezVous.date} à ${rendezVous.heure} a été annulé.`,
        },
        data: { rendezVousId: String(rendezVous.id), statut: 'annulé' }
      });
    }

    res.json({ message: "Rendez-vous annulé avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'annulation" });
  }
};

// TERMINER 
exports.terminerRendezVous = async (req, res) => {
    try {
        const rendezVous = await RendezVous.findByPk(req.params.id);
        if (!rendezVous) {
            return res.status(404).json({ message: "Rendez-vous non trouvé" });
        }

        await rendezVous.update({ statut: 'terminé' });
        res.json({ message: "Rendez-vous marqué comme terminé" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
};

//UPDATE COMPLET 
exports.updateRendezVous = async (req, res) => {
    try {
        const rendezVous = await RendezVous.findByPk(req.params.id);

        if (!rendezVous) {
            return res.status(404).json({ message: "Rendez-vous non trouvé" });
        }

        await rendezVous.update(req.body);

        res.json({ message: "Rendez-vous mis à jour", rendezVous });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
};

exports.confirmerRendezVous = async (req, res) => {
  try {
    const rendezVous = await RendezVous.findByPk(req.params.id, {
      include: [{ model: Utilisateur, attributes: ['fcmToken', 'prenom'] }]
    });

    if (!rendezVous) return res.status(404).json({ message: "Rendez-vous non trouvé" });

    await rendezVous.update({ statut: 'confirmé' });

    const fcmToken = rendezVous.Utilisateur?.fcmToken;
    if (fcmToken) {
      await admin.messaging().send({
        token: fcmToken,
        notification: {
          title: '✅ Rendez-vous confirmé',
          body: `Bonjour ${rendezVous.Utilisateur.prenom}, votre rendez-vous du ${rendezVous.date} à ${rendezVous.heure} est confirmé.`,
        },
        data: { rendezVousId: String(rendezVous.id), statut: 'confirmé' }
      });
    }

    res.json({ message: "Rendez-vous confirmé" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur" });
  }
};

//  UPDATE STATUT 
exports.updateStatut = async (req, res) => {
    try {
        const rendezVous = await RendezVous.findByPk(req.params.id);

        if (!rendezVous) {
            return res.status(404).json({ message: "Rendez-vous non trouvé" });
        }

        await rendezVous.update({ statut: req.body.statut });
        res.json({ message: "Statut mis à jour" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur" });
    }
};
const Utilisateur = require('../models/utilisateurs');
const RendezVous = require('../models/RendezVous');

const SAFE_ATTRS = { exclude: ['password'] };

exports.getAllUtilisateurs = async (req, res) => {
    try {
        const utilisateurs = await Utilisateur.findAll({
            attributes: SAFE_ATTRS,
            order: [['createdAt', 'DESC']],
        });
        res.json(utilisateurs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.getUtilisateurById = async (req, res) => {
    try {
        const utilisateur = await Utilisateur.findByPk(req.params.id, {
            attributes: SAFE_ATTRS,
            include: [{
                model: RendezVous,
                limit: 5,
                order: [['date', 'DESC']],
            }],
        });
        if (!utilisateur) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        res.json(utilisateur);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.updateRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!['client', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Rôle invalide' });
        }
        const utilisateur = await Utilisateur.findByPk(req.params.id);
        if (!utilisateur) return res.status(404).json({ message: 'Utilisateur non trouvé' });

        // Empêcher l'admin de se rétrograder lui-même
        if (utilisateur.id === req.user.id) {
            return res.status(400).json({ message: 'Impossible de modifier votre propre rôle' });
        }

        await utilisateur.update({ role });
        res.json({ message: `Rôle mis à jour : ${role}`, utilisateur: { id: utilisateur.id, role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.deleteUtilisateur = async (req, res) => {
    try {
        const utilisateur = await Utilisateur.findByPk(req.params.id);
        if (!utilisateur) return res.status(404).json({ message: 'Utilisateur non trouvé' });

        if (utilisateur.id === req.user.id) {
            return res.status(400).json({ message: 'Impossible de supprimer votre propre compte' });
        }

        await utilisateur.destroy();
        res.json({ message: 'Utilisateur supprimé' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
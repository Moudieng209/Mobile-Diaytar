const bcrypt = require('bcrypt');
const Utilisateur = require('../models/utilisateurs');
const redisClient = require('../config/redis');
const { generateToken } = require('../utils/jwt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuration de Multer pour le téléchargement d'images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/photos/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `user_${req.user.id}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

exports.upload = multer({ storage });

exports.updatePhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Aucun fichier reçu' });
    const utilisateur = await Utilisateur.findByPk(req.user.id);
    const photoUrl = `${req.protocol}://${req.get('host')}/uploads/photos/${req.file.filename}`;
    await utilisateur.update({ photo: photoUrl });
    res.json({ message: 'Photo mise à jour', photo: photoUrl });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la photo' });
  }
};



exports.inscription = async (req, res) => {
    try {
        const { prenom, nom, email, password, telephone } = req.body;

        const userExists = await Utilisateur.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: "Cet email est déjà utilisé" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const utilisateur = await Utilisateur.create({
            prenom,
            nom,
            email,
            password: hashedPassword,
            telephone,
            role: 'client'
        });

        res.status(201).json({
            message: "Inscription réussie",
            utilisateur: {
                id: utilisateur.id,
                prenom: utilisateur.prenom,
                nom: utilisateur.nom,
                email: utilisateur.email,
                telephone: utilisateur.telephone,
                role: utilisateur.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de l'inscription" });
    }
};

// ====================== CONNEXION ======================
exports.connexion = async (req, res) => {
    try {
        const { email, password } = req.body;

        const utilisateur = await Utilisateur.findOne({ where: { email } });
        if (!utilisateur) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        const validPassword = await bcrypt.compare(password, utilisateur.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        // Génération du token
        const token = generateToken({
            id: utilisateur.id,
            role: utilisateur.role
        });

        // Stockage du token dans Redis (1 heure)
        await redisClient.set(
            token,
            JSON.stringify({
                id: utilisateur.id,
                role: utilisateur.role
            }),
            { EX: 7200 } // 1 heure
        );

        res.json({
            message: "Connexion réussie",
            token,
            utilisateur: {
                id: utilisateur.id,
                prenom: utilisateur.prenom,
                nom: utilisateur.nom,
                email: utilisateur.email,
                telephone: utilisateur.telephone,
                photo: utilisateur.photo,
                role: utilisateur.role,
                createdAt: utilisateur.createdAt,
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la connexion" });
    }
};

// ====================== DÉCONNEXION ======================
exports.deconnexion = async (req, res) => {
    try {
        const header = req.headers['authorization'];
        if (!header) {
            return res.status(400).json({ message: "Token manquant" });
        }

        const token = header.split(' ')[1];
        
        await redisClient.del(token);
        
        res.json({ message: "Déconnexion réussie" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la déconnexion" });
    }
};

// ====================== PROFIL UTILISATEUR ======================
exports.getProfile = async (req, res) => {
    try {
        const utilisateur = await Utilisateur.findByPk(req.user.id, {
            attributes: { exclude: ['password'] } // Ne pas renvoyer le mot de passe
        });

        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.json({ utilisateur });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération du profil" });
    }
};

// ====================== MISE À JOUR DU PROFIL ======================
exports.updateProfile = async (req, res) => {
  try {
    const { prenom, nom, telephone, password } = req.body;
    const utilisateur = await Utilisateur.findByPk(req.user.id);

    const updates = {};
    if (prenom)    updates.prenom    = prenom;
    if (nom)       updates.nom       = nom;
    if (telephone) updates.telephone = telephone;
    if (password)  updates.password  = await bcrypt.hash(password, 10);

    await utilisateur.update(updates);

    res.json({
      message: 'Profil mis à jour',
      utilisateur: {
        id: utilisateur.id, prenom: utilisateur.prenom,
        nom: utilisateur.nom, email: utilisateur.email,
        telephone: utilisateur.telephone, photo: utilisateur.photo,
        role: utilisateur.role,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour' });
  }
};

// ====================== ENREGISTREMENT DU TOKEN FCM ======================
exports.saveFcmToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    if (!fcmToken) return res.status(400).json({ message: 'Token manquant' });

    await Utilisateur.update(
      { fcmToken },
      { where: { id: req.user.id } }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
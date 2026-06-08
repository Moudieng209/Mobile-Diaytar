const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Utilisateur = require('./utilisateurs');
const Service = require('./Service');

const RendezVous = sequelize.define('RendezVous', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    utilisateurId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Utilisateur,
            key: 'id'
        }
    },
    serviceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Service,
            key: 'id'
        }
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    heure: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    statut: {
        type: DataTypes.ENUM('en_attente', 'confirmé', 'annulé', 'terminé'),
        defaultValue: 'en_attente',
    },

    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    tableName: 'rendezvous',
    timestamps: false,
});

RendezVous.belongsTo(Utilisateur, { foreignKey: 'utilisateurId' });
RendezVous.belongsTo(Service, { foreignKey: 'serviceId' });

Utilisateur.hasMany(RendezVous, { foreignKey: 'utilisateurId' });
Service.hasMany(RendezVous, { foreignKey: 'serviceId' });

module.exports = RendezVous;

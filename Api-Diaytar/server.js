require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const sequelize = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const Utilisateur = require('./models/utilisateurs');
const Service = require('./models/Service');
const RendezVous = require('./models/RendezVous');

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/services', require('./routes/services.routes'));
app.use('/api/rendezvous', require('./routes/rendezvous.routes'));
app.use('/api/utilisateurs', require('./routes/utilisateurs.routes'));
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 3000;

// Fonction pour afficher une séparation
const separator = () => console.log('='.repeat(60));

async function startServer() {
  try {
    separator();
    console.log('🔍 Vérification de la connexion à la base de données...');
    
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connecté avec succès !');
    
    console.log('🔄 Synchronisation des modèles...');
    await sequelize.sync({ alter: true });
    console.log('✅ Tables synchronisées !');
    
    separator();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log('\n🎉 SERVEUR DÉMARRÉ AVEC SUCCÈS !\n');
      console.log(`📡 API : http://localhost:${PORT}`);
      console.log(`📖 Swagger : http://localhost:${PORT}/api-docs`);
      console.log(`💾 Base de données : PostgreSQL (sync OK)`);
      console.log(`🕐 Heure de démarrage : ${new Date().toLocaleString()}\n`);
      separator();
    });
    
  } catch (error) {
    console.error('❌ ERREUR CRITIQUE :', error);
    process.exit(1);
  }
}

startServer();
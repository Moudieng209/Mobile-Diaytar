const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'API Gestion des Rendez-vous',
        version: '1.0.0',
        description: 'Documentation automatique de l\'API de gestion des rendez-vous',
    },
    host: 'localhost:3000',
    schemes: ['http'],
    securityDefinitions: {
        BearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            description: 'Entrer: Bearer TOKEN'
        }
    }
};

const outputFile = './swagger-output.json';

const endpointsFiles = [
    './server.js',
];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log('Documentation Swagger générée avec succès !');
});

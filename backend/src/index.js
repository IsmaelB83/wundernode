"use strict";
// Node imports
const express = require('express');
const http = require('http');
// Own imports
const { config } = require('./config');
const { Log } = require('./utils');
const database = require('./database');
const server = require('./app');


// Crear server y arrancarlo
const app = server(express());
initServer();


// Función asincrona para inicializar el servidor
async function initServer() {
    try {
        // Conectar a BD
        let connected = await database.connectToMongo(config.mongodb);
        if (connected === false) {
            Log.fatal('Se cierra la aplicación dado que no es posible conectar a mongodb');
            process.exit(1);
        }
        // Si se conecto a mongo se continua con la inicialización del server express
        const httpServer = http.createServer(app);
        httpServer.listen(config.ports[config.http_type], () => {
            Log.info(`HTTP OK - Server running on port ${config.ports[config.http_type]}`);
        });
    } catch (error) {
        // Error no controlado
        Log.fatal(`HTTP Error - Server not running: ${error.code} ${error.path}`);
        Log.fatal(error);
        process.exit(1);
    }
}

"use strict";
// Import node modules
const mongoose = require('mongoose');
// Import own modules
const { config } = require('../config');
const { Log } = require('../utils');

const database = {
    connectToMongo: async () => {
                        try {
                            // Conecto a la base de datos
                            let db = await mongoose.connect(config.mongodb, { useNewUrlParser: true , useFindAndModify: false });
                            Log.info(`Conectado a mongodb ${db.connection.host}:${db.connection.port}/${db.connection.name}`);
                        } catch (error) {
                            Log.fatal(`Error conectando a mongo: ${error.errno} ${error.address}:${error.port}`);
                        }
                    }
}

module.exports = database;

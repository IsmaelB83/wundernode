"use strict";
// Node imports
const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const crypto = require('crypto');
// Own imports
const TaskList = require('./TaskList');


// User
const UserSchema = new mongoose.Schema(
    {   name: { type: String },
        email: { type: String },
        token: { type: String },
        expire: { type: Date, default: Date.now() + 3600000 },
        active: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

/**
* Función estática para listar anuncios de la base de datos
* @param {String} name Para filtrado por nombre
* @param {String} email Para filtrado por email
* @param {String} active Para filtrado por activo
* @param {String} token Para filtrado por token
* @param {String} limit Para limitar el número de resultados a obtener
* @param {String} skip Para inidicar el número de resultados a saltar
* @param {String} fields Campos a obtener de la colección
* @param {function} callback Función a llamar al terminar la consulta
*/
UserSchema.statics.list = function(name, email, active, token, limit, skip, fields, callback) {
    try {
        // Genero filtrado
        let filter = {}
        if (name) filter.name = { '$regex': `^${name}`, '$options': 'i' };
        if (email) filter.email = { '$regex': `^${email}`, '$options': 'i' };
        if (active) filter.active = active;
        if (token) filter.token = token;
        // Preparo la query
        let queryDB = User.find(filter);
        queryDB.limit(limit);
        queryDB.skip(skip);
        queryDB.select(fields);
        // Query
        queryDB.exec(callback);        
    } catch (error) {
        // Error no controlado
        log.fatal('Error ejecutando consulta.');
        log.fatal(error); 
        callback(error);
    }
}

/**
* Función estática para crear un usuario en mongo
* @param {User} user Usuario a crear en mongo
*/
UserSchema.statics.insert = async function(user) {
    try {
        user.token = crypto.randomBytes(20).toString('hex');
        user.expire = Date.now() + 3600000;
        let res = await user.save();
        TaskList.insertSystemTaskLists(user.id);
        return res;
    } catch (error) {
        log.fatal('Error insertando usuarios.');
        log.fatal(error);
    }
};

/**
* Función estática para actualizar los datos de un usuario
* @param {String} id ID que representa a un usario en MongoDB
* @param {Item} user Objeto con los datos a modificar
*/
UserSchema.statics.updateItem = async function(id, user) {
    try {
        let item = await User.findById(id);
        if (item) {
            item.name = user.name || item.name;
            item.price = user.price || item.price;
            item.type = user.type || item.type;
            item.photo = user.photo || item.photo;
            item.tags = user.tags || item.tags;
            item.description = user.description || item.description;
            return await item.save();
        }
        return false;
    } catch (error) {
        log.fatal('Error insertando anuncio.');
        log.fatal(error);
    }
};

/**
* Función estática para eliminar todos los usuarios
*/
UserSchema.statics.deleteAll = async function() {
    try {
        await User.deleteMany({});
    } catch (error) {
        log.fatal('Error eliminando usuarios.');
        log.fatal(error);
    }
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
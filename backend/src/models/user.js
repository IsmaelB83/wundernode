"use strict";
// Node imports
const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const crypto = require('crypto');
// Own imports
const Log = require('../utils/log');


// User
const UserSchema = new mongoose.Schema(
    {   name: { type: String, required: true, maxlength: 30 },
        email: { type: String, required: true, maxlength: 150, unique: true },
        password: { type: String, required: true, minlength: 8},
        token: { type: String},
        expire: { type: Date, default: Date.now() + 3600000, select: false },
        active: { type: Boolean, default: false, select: false },
        avatar: { type: String, default: ''},
        __v: { type: Number, select: false}
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
        Log.fatal('Error ejecutando consulta.');
        Log.fatal(error); 
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
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
        user.active = false;
        return await user.save();
    } catch (error) {
        Log.fatal('Error insertando usuarios.');
        Log.fatal(error);
        return false;
    }
};

/**
* Función estática para actualizar los datos de un usuario
* @param {String} id ID que representa a un usario en MongoDB
* @param {User} newUser Objeto con los datos a modificar
*/
UserSchema.statics.update = async function(id, newUser) {
    try {
        let oldUser = await User.findById(id);
        if (oldUser) {
            oldUser.name = newUser.name || oldUser.name;
            oldUser.email = newUser.email || oldUser.email;
            return await oldUser.save();
        }
        return false;
    } catch (error) {
        Log.fatal('Error actualizando usuario.');
        Log.fatal(error);
        return false;
    }
};

/**
* Función estática para activar un usuario si se pasa el token válido
* @param {String} id ID que representa a un usario en MongoDB
* @param {String} token Token del usuario
*/
UserSchema.statics.activate = async function(id, token) {
    try {
        let user = await User.findById(id);
        if (user && user.token === token && user.expire >= Date.now()) {
            user.active = true;
            user.expire = null;
            user.token = null;
            return await user.save();
        }
        return false;
    } catch (error) {
        Log.fatal('Error activando usuario.');
        Log.fatal(error);
        return false;
    }
};

/**
* Función estática para eliminar todos los usuarios
*/
UserSchema.statics.deleteAll = async function() {
    try {
        await User.deleteMany({});
    } catch (error) {
        Log.fatal('Error eliminando usuarios.');
        Log.fatal(error);
        return false;
    }
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
"use strict";

const utils = {
    vardump: (object) => JSON.stringify(object, null, 2),
    Log: require('./log'),
    Mail: require('./mail')
}

module.exports = utils;
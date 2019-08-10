const utils = {
    vardump: (object) => JSON.stringify(object, null, 2),
    log: require('./log')
}

module.exports = utils;
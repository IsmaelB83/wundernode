const utils = {
    vardump: (object) => JSON.stringify(object, null, 2),
    mail: require('./email'),
    log: require('./log')
}

module.exports = utils;
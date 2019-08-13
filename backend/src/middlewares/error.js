"use strict";

// Authorization
module.exports = (error, req, res, next) => {
    // Validation error
    if (error.array) { 
        error.status = 422;
        const errInfo = error.array({ onlyFirstError: true })[0];
        error.error = `No válido - ${errInfo.param} ${errInfo.msg}`;
    }
    // status 500 si no se indica lo contrario
    res.status(error.status || 500);
    res.json({
        success: false, 
        error: error
    });
};
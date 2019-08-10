const express = require('express');

module.exports = {
    user: require('./user'),
    tasklist: require('./tasklist'),
    task: require('./task')
}
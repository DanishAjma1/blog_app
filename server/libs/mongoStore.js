const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

const sessionStore = MongoStore.create({
    mongoUrl: mongoose.connection.client.s.url,
    collectionName: 'sessions',
});
module.exports = sessionStore;
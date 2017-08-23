const functions = require('firebase-functions');
const express = require('express');
const fastbootMiddleware = require('fastboot-express-middleware');

let app = express();
app.get('/*', fastbootMiddleware('./dist'));

exports.app = functions.https.onRequest(app);
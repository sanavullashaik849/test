// loggingMiddleware.js

function requestLogger(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
}

function responseLogger(req, res, next) {
    const originalSend = res.send;
    res.send = function (body) {
        console.log(`[${new Date().toISOString()}] ${res.statusCode} - ${JSON.stringify(body)}`);
        originalSend.call(this, body);
    };
    next();
}

module.exports = { requestLogger, responseLogger };

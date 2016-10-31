request = require('request'),
    io = require('socket.io-client'),
    host = process.env.HOST || 'localhost',
    port = parseInt(process.env.PORT) || 8080,
    uuid = process.env.UUID,
    token = process.env.TOKEN,
    url = 'http://' + host + ':' + port;

/**
 * Register device using the RESTful API
 */
function registerDevice(callback) {
    request.post(url + '/devices', function(err, res, body) {
        if (err) {
            console.log('ERROR!', err);
            return;
        }

        callback(JSON.parse(body));
    });
};

/**
 * Stabilish a socket connection with KNoT's cloud
 */
function connectSocket(device, callback) {
    var socket = io(url);

    socket.on('identify', function() {
        console.log('Identifying as ' + device.uuid);

        socket.emit('identity', device);

        // Setup `identitiy` response handlers
        socket.on('ready', function(data) {
            console.log('Websocket successfully connected.');
            console.log('Data: ', data);

            callback(socket);
        });

        socket.on('notReady', function(data) {
            console.log('Websocket connection failed.');
            console.log('Answer: ', data);
        });
    });
};

function registerAndConnect(callback) {
    if (!uuid || !token) {
        registerDevice(function(device) {
            connectSocket(device, function(socket) {
                callback(device, socket);
            });
        });

    } else {
        var device = {
            uuid: uuid,
            token: token
        };

        connectSocket(device, function(socket) {
            callback(device, socket);
        });
    }

};

module.exports = {
    registerDevice: registerDevice,
    connectSocket: connectSocket,
    registerAndConnect: registerAndConnect
};
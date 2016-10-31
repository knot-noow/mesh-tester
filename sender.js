var conn = require('./connector'),
    targetUuid = process.env.TARGET_UUID;

if (!targetUuid) {
    process.exit();
}

conn.registerAndConnect(function(device, socket) {
    console.log('\n\nEmitting message...');

    // config device
    socket.emit('message', {
        devices: [ targetUuid ],
        payload: {
            message: "Hello"
        }
    });
});
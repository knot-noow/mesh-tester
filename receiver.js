var conn = require('./connector'),
    targetUuid = process.env.TARGET_UUID;

if (!targetUuid) {
    process.exit();
}

conn.registerAndConnect(function(device, socket) {
    var updateData = {
        uuid: device.uuid,
        meshblu: {
            version: "2.0.0",
            whitelists: {
                message: {
                    from: [
                        { uuid: targetUuid }
                    ]
                }
            }
        }
    };


    // config device
    socket.emit('update', updateData, function(data) {
        console.log('\n\nUpdate Device Data ', data);

        socket.emit('whoami', {}, function(data) {
            console.log('\n\nThis is me ', JSON.stringify(data));
            console.log('\n\nThis is my whitelist ', JSON.stringify(data.meshblu.whitelists));
        });
    });

    socket.on('message', function(data) {
        console.log('\n\nMessage received', data);
    });
});
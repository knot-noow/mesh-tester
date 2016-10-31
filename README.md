# How to send messages between devices

## Requirements
You will need to have a *Mongo DB* instace.

## Running

Start your mongo instance

```sh
mongod --dbpath /data/db
```

Start your cloud instace of Meshblu

```sh
node server.js --http
```

or, if you do not want to have one source for each instance, use environment variables to config your instance

```sh
# note that you can remove the environment variable `DEBUG` if you do not want to use Meshblu in debug mode.

DEBUG=* TOKEN=cloud PORT=8080 MONGODB_URI=localhost:27017/cloud MESSAGE_BUS_PORT=7777 node meshblu/server.js --http
```

now, if you want to use another Meshblu instance, use an HTTP simulator tool, e.g. Postman, to register a new device in your cloud instance and then start your gateway instance using the UUID and token you got from your cloud instance.

```sh
# replace %UUID% and %TOKEN% with the values you got after registering a new device.

TOKEN=gateway PORT=8081 MONGODB_URI=localhost:27017/gateway MESSAGE_BUS_PORT=7778 PARENT_CONNECTION_UUID=%UUID% PARENT_CONNECTION_TOKEN=%TOKEN% PARENT_CONNECTION_SERVER=localhost PARENT_CONNECTION_PORT=8080 node meshblu/server.js --http
```

## Sending messages

To send messages between devices, first register a new device using your HTTP simulation tool and use the UUID and Token in the following command

```sh
UUID=%UUID% TOKEN=%TOKEN% TARGET_UUID=%TARGET_UUID% HOST=localhost PORT=8080 node knot-cloud-logger/listener.js
```

note that we now have a `TARGET_UUID` variable. That variable should receive the UUID of the device that will send us a message. If you don't have it, just register a new one.

Now, using the UUID and Token of the newly registered device, execute the following command using the UUID of the listener device as %TARGET_UUID%.

```sh
UUID=%UUID% TOKEN=%TOKEN% TARGET_UUID=%TARGET_UUID% HOST=localhost PORT=8080 node knot-cloud-logger/device.js
```
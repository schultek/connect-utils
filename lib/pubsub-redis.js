
/**
 * Publish subscribe architecture using redis.
 */

const platform = require('connect-platform');
var NRP = require('node-redis-pubsub');

var nrp = new NRP(platform.config.get('redis', {}));

nrp.on("error", err => console.log(err))

exports.subscribe = function(channel, callback) {
    return new Promise((resolve, reject) => {
        let unsub = nrp.on(channel, callback, () => {
            resolve(unsub);
        });
    })
}

exports.publish = async function(channel, data) {
    nrp.emit(channel, data);
}


/**
 * Publish subscribe demo architecture.
 * 
 * THIS IS ONLY A DEMO IMPLEMENTATION TO SHOW THE CONCEPT. NOT RECOMMENDED
 * FOR PRODUCTION. DOES NOT WORK WITH MULTIPLE INSTANCES. USE A DISTRIBUTED 
 * ARCHITECTURE LIKE REDIS.
 */

let subscriptions = {}

exports.subscribe = async function(event, callback) {
    if (event in subscriptions) {
        subscriptions[event].push(callback)
    } else {
        subscriptions[event] = [callback];
    }
}

exports.publish = async function(event, message) {
    if (event in subscriptions) {
        subscriptions[event].forEach(cb => cb(message))
        return true;
    } else {
        return false;
    }
}
const redisDB = require("redis");
const redisClient = redisDB.createClient();
redisClient.connect();

redisClient.on('connect', () => {
    console.log('connect to rediss')
});
redisClient.on('ready', () => {
    console.log('connected to redis and ready to use ...');
});
redisClient.on('error', (error) => {
    console.log('redis error', error.message)
});
redisClient.on('end', (error) => {
    console.log('disconnected from redis ....')
});

module.exports = redisClient
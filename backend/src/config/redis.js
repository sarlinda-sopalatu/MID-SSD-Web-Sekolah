const Redis = require('ioredis');

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  retryStrategy: (times) => {
    if (times > 3) return null;
    return Math.min(times * 200, 2000);
  }
});

redisClient.on('error', (err) => {
  console.log('Redis not available, running without cache');
});

module.exports = redisClient;

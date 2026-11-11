module.exports = {
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  redisTls: process.env.REDIS_TLS === "true",
};

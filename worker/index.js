const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  tls: keys.redisTls ? {} : undefined,
  retry_strategy: () => 1000,
});
redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});
const sub = redisClient.duplicate();
sub.on("error", (err) => {
  console.error("Redis subscriber connection error:", err);
});

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

sub.on('message', (channel, message) => {
  redisClient.hset('values', message, fib(parseInt(message)));
});
sub.subscribe('insert');

const keys = require("./keys");

// Express App Setup
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres Client Setup
const { Pool } = require("pg");
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});

pgClient.on("connect", (client) => {
  client
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch((err) => console.error(err));
});

// Redis Client Setup
const redis = require("redis");
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});
const redisPublisher = redisClient.duplicate();
redisPublisher.on("error", (err) => {
  console.error("Redis publisher connection error:", err);
});

// Express route handlers

app.get("/", (req, res) => {
  res.send("Hi");
});

app.get("/values/all", async (req, res) => {
  try {
    const values = await pgClient.query("SELECT * from values");
    res.send(values.rows);
  } catch (err) {
    console.error("Failed to load values from PostgreSQL:", err);
    res.status(503).send("Database unavailable");
  }
});

app.get("/values/current", async (req, res) => {
  redisClient.hgetall("values", (err, values) => {
    if (err) {
      console.error("Failed to load current values from Redis:", err);
      return res.status(503).send("Redis unavailable");
    }

    res.send(values);
  });
});

app.post("/values", async (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > 40) {
    return res.status(422).send("Index too high");
  }

  redisClient.hset("values", index, "Nothing yet!");
  redisPublisher.publish("insert", index);

  try {
    await pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);
    res.send({ working: true });
  } catch (err) {
    console.error("Failed to save value to PostgreSQL:", err);
    res.status(503).send("Database unavailable");
  }
});

app.listen(5000, (err) => {
  console.log("Listening");
});

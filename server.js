var express = require("express");
var redis = require("redis");
const axios = require("axios");

var app = express();

const client = redis.createClient({
  password: "*****",
  socket: {
    host: "*******",
    port: 17936,
  },
});

// Connect to Redis
client
  .connect()
  .then(function () {
    console.log("Connected to Redis");
  })
  .catch(function (err) {
    console.error("Redis connection error:", err);
  });

// Example route using Redis
app.get("/Hello", async (req, res) => {
  const cacheValued = await client.get("user");
  if (cacheValued) {
    return res.json(JSON.parse(cacheValued));
  }
  const { data } = await axios.get(
    "https://jsonplaceholder.typicode.com/users"
  );
  await client.set("user", JSON.stringify(data));
  res.json(data);
});

app.get("/", async (req, res) => {
  const cache = await client.get("Hello");
  if (cache) return res.json(cache);
  else {
    await client.set("Hello", "How are you");
    res.json({
      message: "Data Sent",
    });
  }
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("Server running on port " + PORT);
});

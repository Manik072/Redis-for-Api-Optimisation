const express = require("express");
const redis = require("redis");
const axios = require("axios");

const app = express();
const client = redis.createClient({
  host: "localhost",
  port: 6379,
});

client.on("error", (err) => console.log("Redis Client Error", err));

// Connect to Redis
(async () => {
  await client.connect();
})();

// Use Redis in your routes
app.get("/posts", async (req, res) => {
  const cachedValue = await client.get("posts");
  if (cachedValue) {
    res.json(JSON.parse(cachedValue));
  } else {
    const { data } = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );
    await client.set("posts", JSON.stringify(data));
    res.json(data);
  }
});

app.get("/comments", async (req, res) => {
  const cachedValue = await client.get("comments");
  if (cachedValue) {
    res.json(JSON.parse(cachedValue));
  } else {
    const { data } = await axios.get(
      "https://jsonplaceholder.typicode.com/comments"
    );
    await client.set("comments", JSON.stringify(data));
    res.json(data);
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

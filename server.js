import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import { validateUser, validatePost } from "./users.middleware.js";

const app = express();
app.use(express.json());

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

let db, users, posts;

!(async () => {
  db = client.db("dars_db");
  users = db.collection("users");
  posts = db.collection("posts");
  console.log("MongoDB connection ✅");
})();

app.get("/users", async (req, res, next) => {
  try {
    const us = await users.find().toArray();
    res.json(us);
  } catch (error) {
    next(error);
  }
});

app.post("/users", validateUser, async (req, res, next) => {
  try {
    const result = await users.insertOne(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.put("/users/:id", validateUser, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, age } = req.body;
    const body = await users.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: { name, age },
    },
  );
  res.json(body);
} catch (error) {
  next(error);
}
});

app.delete("/users", async (req, res, next) => {
  try {
    const { name } = req.body;
    const del = await users.deleteMany({ name });
    res.json(del);
  } catch (error) {
    next(error);
  }
});

app.get("/posts", async (req, res, next) => {
  try {
    const ps = await posts.find().toArray();
    res.json(ps);
  } catch (error) {
    next(error);
  }
});

app.post("/posts", validatePost, async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await users.findOne({ _id: new ObjectId(userId) });
    
    if (!user) return res.json({ error: "User not found" });
    let newPost = { ...req.body, userId: new ObjectId(user._id) };
    const result = await posts.insertOne(newPost);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.put("/posts/:id", validatePost, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, decreption } = req.body;
    console.log();
    
    const body = await posts.updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: { title, decreption },
    },
  );
  res.json(body);
} catch (error) {
  next(error);
}
});

app.delete("/posts", async (req, res, next) => {
  try {
  const { title, id } = req.query;
  if (!title && !id)
    return res.json({ error: "title is required or input id" });
  const del = await posts.deleteMany({ title });
  res.json(del);
} catch (error) {
  next(error);
}
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({
    message: error.message || "Serverda noma'lum xato yuz berdi",
  });
});

app.listen(3434, () => console.log("server is runned"));

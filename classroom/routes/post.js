const express = require("express");
const router = express.Router();

//Posts
//Index - user
router.get("/", (req, res) => {
  res.send("Get for Post");
});

//Show - user
router.get("/:id", (req, res) => {
  res.send("Get for show Post id");
});

//POST - user
router.post("/", (req, res) => {
  res.send("Post for Post");
});

//Delete - user
router.delete("/:id", (req, res) => {
  res.send("Delete for Post id");
});

module.exports=router;

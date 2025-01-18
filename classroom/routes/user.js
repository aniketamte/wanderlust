const express = require("express");
const router = express.Router();

//Index - user
router.get("/", (req, res) => {
  res.send("Get for users");
});

//Show - user
router.get("/:id", (req, res) => {
  res.send("Get for show users id");
});

//POST - user
router.post("/", (req, res) => {
  res.send("Post for users");
});

//Delete - user
router.delete("/:id", (req, res) => {
  res.send("Delete for users id");
});

module.exports=router;
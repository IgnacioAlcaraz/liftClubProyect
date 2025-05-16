const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth");
const verifyTempToken = require("../middlewares/verifyTempToken");

router.get("/", auth, userController.getUsers);

router.get("/:id", auth, userController.getUserById);

router.put("/:id", auth, userController.updateUser);

module.exports = router;

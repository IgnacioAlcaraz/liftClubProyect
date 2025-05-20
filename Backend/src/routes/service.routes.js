const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/service.controller");
const auth = require("../middlewares/auth");

router.get("/", serviceController.getServices);

router.post("/", auth, serviceController.createService);

router.get("/:id", auth, serviceController.getServiceById);

router.put("/:id", auth, serviceController.updateServiceById);

router.delete("/:id", auth, serviceController.deleteServiceById);

router.get("/coach/:coachId", auth, serviceController.getServiceByCoachId);

module.exports = router;

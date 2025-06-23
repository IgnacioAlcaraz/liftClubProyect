const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/service.controller");
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");

router.get("/", serviceController.getServices);

router.post("/", auth, upload.array("images"), serviceController.createService);

router.get("/:id", auth, serviceController.getServiceById);

router.put(
  "/:id",
  auth,
  upload.array("images"),
  serviceController.updateServiceById
);

router.delete("/:id", auth, serviceController.deleteServiceById);

router.get("/coach/:coachId", auth, serviceController.getServiceByCoachId);

router.post("/:id/views", auth, serviceController.incrementViews);

router.get("/:id/occupiedSessions", serviceController.getOccupiedSessions);

module.exports = router;

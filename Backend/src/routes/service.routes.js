const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/service.controller");
const auth = require("../middlewares/auth");

router.get("/", serviceController.getServices); //este no necesita token, ya que pueden verlo todos sin iniicar sesion

router.post("/", auth, serviceController.createService); // crear un servicio para un coach

router.get("/:id", auth, serviceController.getServiceById); //ver todos los detalles de un servicio

router.put("/:id", auth, serviceController.updateServiceById); //actualizar un servicio

router.delete("/:id", auth, serviceController.deleteServiceById); //eliminar un servicio

router.get("/coach/:coachId", auth, serviceController.getServiceByCoachId);

module.exports = router;

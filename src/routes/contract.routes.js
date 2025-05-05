const express = require("express");
const router = express.Router();
const contractController = require("../controllers/contract.controller");
const auth = require("../middlewares/auth");

// todos usan el decorador de auth, debido a la privacidad de los contratos

router.get("/", auth, contractController.getContracts); //obtener todos los contratos

router.post("/", auth, contractController.createContract); //crear un contrato

router.get("/:id", auth, contractController.getContractById); //ver todos los detalles de un contrato particular

router.patch("/:id", auth, contractController.updateContractStatusById); //actualizar el estado de un contrato (aceptar, rechazar, etc)

router.get("/:id/files", auth, contractController.getContractFilesById); //ver todos los archivos de un contrato particular

router.post("/:id/files", auth, contractController.uploadContractFiles); //subir archivos a un contrato particular

router.get(
  "/:id/scheduledSessions",
  auth,
  contractController.getScheduledSessionsByContractId
); //ver todas las sesiones programadas de un contrato particular

router.post(
  "/:id/scheduledSessions",
  auth,
  contractController.createScheduledSession
); //crear una sesión programada para un contrato particular

router.put(
  "/:id/scheduledSessions/:sessionId",
  auth,
  contractController.updateScheduledSessionStatusById
); //actualizar estado una sesión programada de un contrato particular

module.exports = router;

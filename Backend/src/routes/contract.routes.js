const express = require("express");
const router = express.Router();
const contractController = require("../controllers/contract.controller");
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");

router.get("/", auth, contractController.getContracts);

router.post("/", auth, contractController.createContract);

router.get("/pending", auth, contractController.getPendingContracts);

router.get("/:id", auth, contractController.getContractById);

router.patch("/:id", auth, contractController.updateContractStatusById);

router.get("/:id/files", auth, contractController.getContractFilesById);

router.get("/user/scheduledSessions", auth, contractController.getScheduledSessions);

router.post(
  "/:id/files",
  auth,
  upload.array("files"),
  contractController.uploadContractFiles
);

router.get("/:id/files/:fileName", auth, contractController.downloadContractFile);

router.get(
  "/:id/scheduledSessions",
  auth,
  contractController.getScheduledSessionsByContractId
);

router.post(
  "/:id/scheduledSessions",
  auth,
  contractController.createScheduledSession
);

router.patch(
  "/:id/scheduledSessions/:sessionId",
  auth,
  contractController.updateScheduledSessionStatusById
);

module.exports = router;

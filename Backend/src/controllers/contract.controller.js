const contractService = require("../services/contract.service");
const Contract = require("../models/Contract");
const path = require("path");

const getContracts = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const contracts = await contractService.getContracts(userId, role);
    return res.status(200).json(contracts);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener los contratos",
      error: error.message,
    });
  }
};

const getScheduledSessions = async (req, res) => {
  try {
    const { userId, role } = req.user;

    const sessions = await contractService.getScheduledSessions(userId, role);

    res.status(200).json(sessions);
  } catch (error) {
    if (error.message === "No se encontraron contratos") {
      return res.status(404).json({ message: error.message });
    }
    console.error("Error al obtener sesiones del cliente:", error);
    res.status(500).json({ message: "Error al obtener las sesiones" });
  }
};

const createContract = async (req, res) => {
  try {
    const { userId } = req.user;
    const savedContract = await contractService.createContract(
      req.body,
      userId
    );
    return res.status(201).json(savedContract);
  } catch (error) {
    if (
      error.message === "Servicio no encontrado" ||
      error.message === "Solo los clientes pueden crear contratos"
    ) {
      return res.status(400).json({ message: error.message });
    }
    return res
      .status(500)
      .json({ message: "Error creando el contrato", error: error.message });
  }
};

const getContractById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;
    const contract = await contractService.getContractById(id, userId, role);
    return res.status(200).json(contract);
  } catch (error) {
    if (error.message === "Contrato no encontrado") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes("No tienes permiso")) {
      return res.status(403).json({ message: error.message });
    }
    return res
      .status(500)
      .json({ message: "Error al obtener el contrato", error: error.message });
  }
};

const updateContractStatusById = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { userId, role } = req.user;

    const contract = await contractService.updateContractStatusById(
      id,
      status,
      userId,
      role
    );
    return res.status(200).json(contract);
  } catch (error) {
    if (error.message === "Contrato no encontrado") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes("No tienes permiso")) {
      return res.status(403).json({ message: error.message });
    }
    return res.status(500).json({
      message: "Error al actualizar el contrato",
      error: error.message,
    });
  }
};

const getContractFilesById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;
    const files = await contractService.getContractFilesById(id, userId, role);
    return res.status(200).json(files);
  } catch (error) {
    if (error.message === "Contrato no encontrado") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({
      message: "Error al obtener los archivos del contrato",
      error: error.message,
    });
  }
};

const uploadContractFiles = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;

    const files = await contractService.uploadContractFiles(
      id,
      req.files,
      userId,
      role
    );
    return res
      .status(200)
      .json({ message: "Archivos subidos correctamente", files });
  } catch (error) {
    if (
      error.message === "Contrato no encontrado" ||
      error.message === "Archivo no encontrado"
    ) {
      return res.status(404).json({ message: error.message });
    }
    if (
      error.message.includes("No tienes permiso") ||
      error.message.includes("Solo el coach")
    ) {
      return res.status(403).json({ message: error.message });
    }
    if (error.message === "No se han subido archivos") {
      return res.status(400).json({ message: error.message });
    }
    return res
      .status(500)
      .json({ message: "Error al subir archivos", error: error.message });
  }
};

const downloadContractFile = async (req, res) => {
  try {
    const { id, fileName } = req.params;
    const { userId, role } = req.user;

    const file = await contractService.downloadContractFile(
      id,
      fileName,
      userId,
      role
    );

    return res.download(file.path, file.name);
  } catch (error) {
    if (
      error.message === "Contrato no encontrado" ||
      error.message === "Archivo no encontrado"
    ) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes("No tienes permiso")) {
      return res.status(403).json({ message: error.message });
    }
    return res
      .status(500)
      .json({ message: "Error al descargar el archivo", error: error.message });
  }
};

const getScheduledSessionsByContractId = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;

    const sessions = await contractService.getScheduledSessionsByContractId(
      id,
      userId,
      role
    );
    return res.status(200).json(sessions);
  } catch (error) {
    if (error.message === "Contrato no encontrado") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes("No tienes permiso")) {
      return res.status(403).json({ message: error.message });
    }
    return res.status(500).json({
      message: "Error al obtener las sesiones programadas",
      error: error.message,
    });
  }
};

const updateScheduledSessionStatusById = async (req, res) => {
  try {
    const { id, sessionId } = req.params;
    const { status } = req.body;
    const { userId, role } = req.user;

    const session = await contractService.updateScheduledSessionStatusById(
      id,
      sessionId,
      status,
      userId,
      role
    );
    return res.status(200).json(session);
  } catch (error) {
    if (
      error.message === "Contrato no encontrado" ||
      error.message === "Sesión no encontrada"
    ) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes("No tienes permiso")) {
      return res.status(403).json({ message: error.message });
    }
    return res.status(500).json({
      message: "Error al actualizar la sesión programada",
      error: error.message,
    });
  }
};

const createScheduledSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;

    const session = await contractService.createScheduledSession(
      id,
      req.body,
      userId,
      role
    );

    return res.status(201).json(session);
  } catch (error) {
    return res.status(500).json({
      message: "Error al crear la sesión programada",
      error: error.message,
    });
  }
};

const getPendingContracts = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const contracts = await contractService.getPendingContracts(userId, role);
    return res.status(200).json(contracts);
  } catch (error) {
    if (error.message.includes("No se encontraron")) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({
      message: "Error al obtener los contratos pendientes",
      error: error.message,
    });
  }
};

module.exports = {
  getContracts,
  createContract,
  getContractById,
  updateContractStatusById,
  getContractFilesById,
  uploadContractFiles,
  downloadContractFile,
  getScheduledSessionsByContractId,
  updateScheduledSessionStatusById,
  createScheduledSession,
  getPendingContracts,
  getScheduledSessions,
};

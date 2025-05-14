const Contract = require("../models/Contract");
const Service = require("../models/Service");
const User = require("../models/User");

const getContracts = async (userId, role) => {
  if (role === "client") {
    return await Contract.find({ clientId: userId });
  }

  else if (role === "coach") {
    return await Contract.find({ coachId: userId });
  }

  return await Contract.find();
};

const createContract = async (contractData, userId) => {
  const service = await Service.findById(contractData.serviceId);
  if (!service) {
    throw new Error("Servicio no encontrado");
  }
  
  const user = await User.findById(userId);
  if (user.role !== "client") {
    throw new Error("Solo los clientes pueden crear contratos");
  }
  
  const newContract = new Contract({
    ...contractData,
    clientId: userId,
    coachId: service.coachId,
  });
  
  return await newContract.save();
};

const getContractById = async (id, userId, role) => {
  const contract = await Contract.findById(id);
  
  if (!contract) {
    throw new Error("Contrato no encontrado");
  }
  
  if (role === "client" && contract.clientId.toString() !== userId.toString()) {
    throw new Error("No tienes permiso para ver este contrato");
  } else if (role === "coach" && contract.coachId.toString() !== userId.toString()) {
    throw new Error("No tienes permiso para ver este contrato");
  }
  
  return contract;
};

const updateContractStatusById = async (id, status, userId, role) => {
  const contract = await Contract.findById(id);
  
  if (!contract) {
    throw new Error("Contrato no encontrado");
  }
  
  if (role === "coach" && contract.coachId.toString() !== userId.toString()) {
    throw new Error("No tienes permiso para actualizar este contrato");
  } else if (role === "client" && contract.clientId.toString() !== userId.toString()) {
    throw new Error("No tienes permiso para actualizar este contrato");
  }
  
  contract.status = status;
  return await contract.save();
};

const getContractFilesById = async (id, userId, role) => {
  const contract = await getContractById(id, userId, role);
  return contract.files;
};

const uploadContractFiles = async (id, files, userId, role) => {
  const contract = await getContractById(id, userId, role);
  
  if (role !== "coach" || contract.coachId.toString() !== userId.toString()) {
    throw new Error("Solo el coach puede subir archivos");
  }
  
  if (!files || files.length === 0) {
    throw new Error("No se han subido archivos");
  }
  
  const fileObjects = files.map((file) => ({
    name: file.originalname,
    path: file.path,
    mimeType: file.mimetype,
    size: file.size,
    uploadDate: new Date(),
  }));
  
  contract.files.push(...fileObjects);
  await contract.save();
  
  return fileObjects;
};

const downloadContractFile = async (id, fileId, userId, role) => {
  const contract = await getContractById(id, userId, role);

  const file = contract.files.id(fileId);
  if (!file) {
    throw new Error("Archivo no encontrado");
  }
  
  return file;
};

const getScheduledSessionsByContractId = async (id, userId, role) => {
  const contract = await getContractById(id, userId, role);
  return contract.scheduledSessions;
};

const updateScheduledSessionStatusById = async (id, sessionId, status, userId, role) => {
  const contract = await getContractById(id, userId, role);
  
  const session = contract.scheduledSessions.id(sessionId);
  if (!session) {
    throw new Error("Sesión no encontrada");
  }
  
  session.status = status;
  await contract.save();
  
  return session;
};

const createScheduledSession = async (id, sessionData, userId, role) => {
  const contract = await getContractById(id, userId, role);
  
  if (contract.status !== "Aceptado") {
    throw new Error("Solo se pueden programar sesiones en contratos aceptados");
  }
  
  if (!sessionData.date || !sessionData.startTime || !sessionData.endTime) {
    throw new Error("Faltan datos para crear la sesión");
  }
  
  const newSession = {
    contractId: id,
    date: sessionData.date,
    startTime: sessionData.startTime,
    endTime: sessionData.endTime,
    status: "Pendiente",
  };
  
  contract.scheduledSessions.push(newSession);
  await contract.save();
  
  return contract.scheduledSessions[contract.scheduledSessions.length - 1];
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
};
const Contract = require("../models/Contract");
const Service = require("../models/Service");
const User = require("../models/User");
const path = require("path");

const getContracts = async (userId, role) => {
  let query;
  if (role === "client") {
    query = Contract.find({ clientId: userId });
  } else if (role === "coach") {
    query = Contract.find({ coachId: userId });
  } else {
    query = Contract.find();
  }

  const contracts = await query
    .populate("serviceId")
    .populate("coachId", "firstName lastName")
    .populate("clientId", "firstName lastName");

  return contracts.filter((c) => c.serviceId !== null);
};

const getScheduledSessions = async (userId, role) => {
  let contracts;
  if (role === "client") {
    contracts = await Contract.find({ clientId: userId })
      .populate("serviceId", "name")
      .populate("coachId", "firstName lastName")
      .populate("clientId", "firstName lastName");
  } else if (role === "coach") {
    contracts = await Contract.find({ coachId: userId })
      .populate("serviceId", "name")
      .populate("coachId", "firstName lastName")
      .populate("clientId", "firstName lastName");
  }

  if (!contracts) {
    throw new Error("No se encontraron contratos");
  }

  const todasLasSesiones = contracts.flatMap((contract) =>
    contract.scheduledSessions.map((session) => ({
      ...session.toObject(),
      contractId: contract._id,
      service: contract.serviceId,
      coach: contract.coachId,
      client: contract.clientId,
    }))
  );

  return todasLasSesiones;
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

  //  Verificar si ya existe un contrato con ese transactionId
  if (contractData.paymentDetails?.transactionId) {
    const contratoExistente = await Contract.findOne({
      "paymentDetails.transactionId": contractData.paymentDetails.transactionId,
    });

    if (contratoExistente) {
      return contratoExistente;
    }
  }

  const newContract = new Contract({
    ...contractData,
    clientId: userId,
    coachId: service.coachId,
  });

  return await newContract.save();
};

const getContractById = async (id, userId, role) => {
  const contract = await Contract.findById(id).populate("serviceId");

  if (!contract) {
    throw new Error("Contrato no encontrado");
  }

  if (role === "client" && contract.clientId.toString() !== userId.toString()) {
    throw new Error("No tienes permiso para ver este contrato");
  } else if (
    role === "coach" &&
    contract.coachId.toString() !== userId.toString()
  ) {
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
  } else if (
    role === "client" &&
    contract.clientId.toString() !== userId.toString()
  ) {
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
  const contract = await Contract.findById(id);

  if (!contract) {
    throw new Error("Contrato no encontrado");
  }

  if (role !== "coach" || contract.coachId.toString() !== userId.toString()) {
    throw new Error("Solo el coach puede subir archivos");
  }

  if (!files || files.length === 0) {
    throw new Error("No se han subido archivos");
  }

  const fileObjects = files.map((file) => ({
    name: file.originalname,
    path: `/uploads/${file.filename}`,
    mimeType: file.mimetype,
    size: file.size,
    uploadDate: new Date(),
  }));

  await Contract.updateOne(
    { _id: id },
    { $push: { files: { $each: fileObjects } } }
  );

  return fileObjects;
};

const downloadContractFile = async (id, fileName, userId, role) => {
  const contract = await getContractById(id, userId, role);

  const file = contract.files.find((f) => f.name === fileName);
  if (!file) {
    throw new Error("Archivo no encontrado");
  }

  const absolutePath = path.join(__dirname, "..", file.path);
  return { ...file, path: absolutePath };
};

const getScheduledSessionsByContractId = async (id, userId, role) => {
  const contract = await getContractById(id, userId, role);
  return contract.scheduledSessions;
};

const updateScheduledSessionStatusById = async (
  id,
  sessionId,
  status,
  userId,
  role
) => {
  const contract = await getContractById(id, userId, role);

  const session = contract.scheduledSessions.id(sessionId);
  if (!session) {
    throw new Error("Sesión no encontrada");
  }

  session.status = status;
  await contract.save();

  // Verificar si se deben marcar como completado el contrato
  if (status === "Completado") {
    const completadas = contract.scheduledSessions.filter(
      (s) => s.status === "Completado"
    ).length;

    const necesarias = contract.serviceId.duration;

    if (completadas >= necesarias) {
      contract.status = "Completado";
      await contract.save();
    }
  }

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

  // Guardar en el servicio
  const serviceId = contract.serviceId;
  const service = await Service.findById(serviceId);
  if (!service) throw new Error("Servicio no encontrado");

  const sessionForService = {
    date: sessionData.date,
    startTime: sessionData.startTime,
    endTime: sessionData.endTime,
    contractId: contract._id,
    clientId: contract.clientId,
  };

  service.allScheduledSessions.push(sessionForService);
  await service.save();

  return contract.scheduledSessions[contract.scheduledSessions.length - 1];
};

const getPendingContracts = async (userId, role) => {
  if (role !== "coach") {
    throw new Error("Solo los coaches pueden ver los contratos pendientes");
  }

  const contracts = await Contract.find({
    status: "Pendiente",
    coachId: userId,
  })
    .populate("clientId", "firstName lastName")
    .populate("serviceId", "name price")
    .sort({ createdAt: -1 });

  if (!contracts) {
    throw new Error("No se encontraron contratos pendientes");
  }

  return contracts;
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

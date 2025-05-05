const Contract = require("../models/Contract");

const getContracts = async (req, res) => {
  try {
    const contracts = await Contract.find();
    res.status(200).json(contracts);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los contratos", error });
  }
};

const createContract = async (req, res) => {
  try {
    const contractData = {
      ...req.body,
    };

    const newContract = new Contract(contractData);
    const savedContract = await newContract.save();

    res.status(201).json(savedContract);
  } catch (error) {
    res.status(500).json({ message: "Error creando el contrato", error });
  }
};

const getContractById = async (req, res) => {
  try {
    const { id } = req.params;
    const contract = await Contract.findById(id);

    if (!contract) {
      return res.status(404).json({ message: "Contrato no encontrado." });
    }

    res.status(200).json(contract);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el contrato", error });
  }
};

const updateContractStatusById = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const contract = await Contract.findById(id);

    if (!contract) {
      return res.status(404).json({ message: "Contrato no encontrado." });
    }

    contract.status = status;
    await contract.save();

    res.status(200).json(contract);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el contrato", error });
  }
};

const getContractFilesById = async (req, res) => {
  try {
    const { id } = req.params;
    const contract = await Contract.findById(id);
    if (!contract) {
      return res.status(404).json({ message: "Contrato no encontrado." });
    }
    res.status(200).json(contract.fileIds);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los archivos del contrato", error });
  }
};

//Definir model de file para prueba concreta
const uploadContractFiles = async (req, res) => {
  try {
    const { id } = req.params;
    const contract = await Contract.findById(id);
    if (!contract) {
      return res.status(404).json({ message: "Contrato no encontrado." });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No se han subido archivos." });
    }
    /* ... */
  } catch (error) {
    res.status(500).json({ message: "Error al subir archivos", error });
  }
};

const getScheduledSessionsByContractId = async (req, res) => {
  try {
    const { id } = req.params;
    const contract = await Contract.findById(id);
    if (!contract) {
      return res.status(404).json({ message: "Contrato no encontrado." });
    }
    res.status(200).json(contract.scheduledSessions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las sesiones programadas", error });
  }
};

const updateScheduledSessionStatusById = async (req, res) => {
  try {
    const { id, sessionId } = req.params;
    const { status } = req.body;

    const contract = await Contract.findById(id);
    if (!contract) {
      return res.status(404).json({ message: "Contracto no encontrado." });
    }
    const session = contract.scheduledSessions.id(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Sesion no encontrada." });
    }

    session.status = status;
    await contract.save();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar la sesión programada.", error });
  }
};

const createScheduledSession = async (req, res) => {
  const { id } = req.params;
  const { date, startTime, endTime } = req.body;
  try {
    const contract = await Contract.findById(id);
    if (!contract) {
      return res.status(404).json({ message: "Contrato no encontrado." });
    }

    const newSession = {
      date,
      startTime,
      endTime,
      status: "Pendiente",
    };

    contract.scheduledSessions.push(newSession);
    await contract.save();

    res.status(201).json(newSession);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear la sesión programada.", error });
  }
};

module.exports = {
  getContracts,
  createContract,
  getContractById,
  updateContractStatusById,
  getContractFilesById,
  uploadContractFiles,
  getScheduledSessionsByContractId,
  updateScheduledSessionStatusById,
  createScheduledSession,
};

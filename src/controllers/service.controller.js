const serviceService = require("../services/service.service");

const getServices = async (req, res) => {
  try {
    const services = await serviceService.getServices();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los servicios",
      error: error.message,
    });
  }
};

const createService = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== "coach") {
      return res
        .status(403)
        .json({ message: "Solo los coaches pueden crear servicios" });
    }

    const savedService = await serviceService.createService(
      req.body,
      user.userId
    );
    res.status(201).json(savedService);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el servicio", error: error.message });
  }
};

const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await serviceService.getServiceById(id);
    res.status(200).json(service);
  } catch (error) {
    if (error.message === "Servicio no encontrado") {
      return res.status(404).json({ message: error.message });
    }
    res
      .status(500)
      .json({ message: "Error al obtener el servicio", error: error.message });
  }
};

const updateServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const updatedService = await serviceService.updateServiceById(
      id,
      req.body,
      user.userId
    );
    res.status(200).json(updatedService);
  } catch (error) {
    if (error.message === "Servicio no encontrado") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "No tienes permiso para editar este servicio") {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({
      message: "Error al actualizar el servicio",
      error: error.message,
    });
  }
};

const deleteServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const result = await serviceService.deleteServiceById(id, user.userId);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "Servicio no encontrado") {
      return res.status(404).json({ message: error.message });
    }
    if (
      error.message.includes("No tienes permiso") ||
      error.message.includes("no tiene un coach")
    ) {
      return res.status(403).json({ message: error.message });
    }
    res
      .status(500)
      .json({ message: "Error al eliminar el servicio", error: error.message });
  }
};

const getServiceByCoachId = async (req, res) => {
  try {
    const { coachId } = req.params;
    const services = await serviceService.getServiceByCoachId(coachId);
    res.status(200).json(services);
  } catch (error) {
    if (error.message === "ID de coach no proporcionado") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({
      message: "Error al obtener los servicios del coach",
      error: error.message,
    });
  }
};

module.exports = {
  getServices,
  createService,
  getServiceById,
  updateServiceById,
  deleteServiceById,
  getServiceByCoachId,
};

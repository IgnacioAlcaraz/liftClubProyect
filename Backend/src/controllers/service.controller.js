const serviceService = require("../services/service.service");

const getServices = async (req, res) => {
  try {
    const services = await serviceService.getServices();
    res.status(200).json(services);
  } catch (error) {
    return res.status(500).json({
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

    let serviceData = { ...req.body };
    if (req.body.availability) {
      try {
        serviceData.availability = JSON.parse(req.body.availability);
      } catch (error) {
        console.error("Error al parsear availability:", error);
        return res.status(400).json({
          message: "Error en el formato de availability",
          error: error.message,
        });
      }
    }

    const savedService = await serviceService.createService(
      serviceData,
      user.userId,
      req.files
    );
    res.status(201).json(savedService);
  } catch (error) {
    console.error("Error al crear servicio:", error);
    if (error.message.includes("disponibilidad")) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error al crear el servicio" });
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
    return res
      .status(500)
      .json({ message: "Error al obtener el servicio", error: error.message });
  }
};

const updateServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    let serviceData = { ...req.body };
    if (req.body.availability) {
      try {
        serviceData.availability = JSON.parse(req.body.availability);
      } catch (error) {
        console.error("Error al parsear availability en update:", error);
        return res.status(400).json({
          message: "Error en el formato de availability",
          error: error.message,
        });
      }
    }

    const updatedService = await serviceService.updateServiceById(
      id,
      serviceData,
      user.userId,
      req.files
    );
    res.status(200).json(updatedService);
  } catch (error) {
    if (error.message === "Servicio no encontrado") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "No tienes permiso para editar este servicio") {
      return res.status(403).json({ message: error.message });
    }
    return res.status(500).json({
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
    return res
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
    return res.status(500).json({
      message: "Error al obtener los servicios del coach",
      error: error.message,
    });
  }
};

const incrementViews = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await serviceService.incrementViews(id);
    res.status(200).json(service);
  } catch (error) {
    return res.status(500).json({
      message: "Error al incrementar las vistas",
      error: error.message,
    });
  }
};

const getOccupiedSessions = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "La fecha es obligatoria" });
    }

    const sesiones = await serviceService.getOccupiedSessions(id, date);
    res.status(200).json(sesiones);
  } catch (error) {
    console.error("Error al obtener sesiones ocupadas:", error);
    return res.status(500).json({
      message: "Error al obtener sesiones ocupadas",
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
  incrementViews,
  getOccupiedSessions,
};

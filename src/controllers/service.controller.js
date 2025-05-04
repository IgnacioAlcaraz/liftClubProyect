const Service = require("../models/Service"); // Ajusta la ruta si es diferente

// Obtener todos los servicios (acceso público)
const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los servicios", error });
  }
};

// Crear un nuevo servicio (requiere autenticación)
const createService = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== "coach") {
      return res
        .status(403)
        .json({ message: "Solo los coaches pueden crear servicios" });
    }

    const serviceData = {
      ...req.body,
      coachId: user.userId,
    };

    const newService = new Service(serviceData);
    const savedService = await newService.save();

    res.status(201).json(savedService);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el servicio", error });
  }
};

// Obtener un servicio por ID (requiere autenticación)
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ message: "Servicio no encontrado" });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el servicio", error });
  }
};

// Actualizar un servicio (requiere autenticación y ser el dueño)
const updateServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ message: "Servicio no encontrado" });
    }

    if (service.coachId.toString() !== user.userId.toString()) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para editar este servicio" });
    }

    const updatedService = await Service.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el servicio", error });
  }
};

// Eliminar un servicio (requiere autenticación y ser el dueño)
const deleteServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ message: "Servicio no encontrado" });
    }

    // Verificar si el servicio tiene un coachId
    if (!service.coachId) {
      return res.status(403).json({
        message:
          "No se puede eliminar este servicio porque no tiene un coach asignado",
      });
    }

    // Convertir ambos IDs a string para comparación
    if (service.coachId.toString() !== user.userId) {
      return res.status(403).json({
        message: "No tienes permiso para eliminar este servicio",
      });
    }

    await Service.findByIdAndDelete(id);
    res.status(200).json({ message: "Servicio eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar servicio:", error);
    res
      .status(500)
      .json({ message: "Error al eliminar el servicio", error: error.message });
  }
};

// Obtener servicios por ID del coach - VERSIÓN CORREGIDA
const getServiceByCoachId = async (req, res) => {
  try {
    const { coachId } = req.params;

    // Validar el formato del ID
    if (!coachId) {
      return res.status(400).json({ message: "ID de coach no proporcionado" });
    }

    // Versión con más detalles para depuración
    const services = await Service.find({ coachId: coachId });


    // Devolver todos los servicios encontrados
    res.status(200).json(services);
  } catch (error) {
    console.error("Error al obtener servicios del coach:", error);
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

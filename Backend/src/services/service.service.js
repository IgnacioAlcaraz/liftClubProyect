const Service = require("../models/Service");
const Contract = require("../models/Contract");
const fs = require("fs");
const path = require("path");

const getServices = async () => {
  const services = await Service.find({ visibility: "Pública" }).populate(
    "coachId",
    "firstName lastName"
  );
  return services;
};

const validateAvailability = (availability) => {
  if (!Array.isArray(availability)) {
    throw new Error("La disponibilidad debe ser un arreglo");
  }

  const daysUsed = new Set();

  for (const slot of availability) {
    if (!slot.date || !slot.startTime || !slot.endTime) {
      throw new Error("Todos los campos de disponibilidad son obligatorios");
    }

    if (daysUsed.has(slot.date)) {
      throw new Error(`Ya existe una disponibilidad para el día ${slot.date}`);
    }
    daysUsed.add(slot.date);

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):00$/;
    if (!timeRegex.test(slot.startTime) || !timeRegex.test(slot.endTime)) {
      throw new Error("El formato de las horas debe ser HH:00");
    }

    const start = parseInt(slot.startTime.split(":")[0]);
    const end = parseInt(slot.endTime.split(":")[0]);

    if (end <= start) {
      throw new Error(
        `La hora de fin debe ser mayor que la hora de inicio para el día ${slot.date}`
      );
    }
  }
};

const createService = async (serviceData, userId, files) => {
  try {
    if (serviceData.availability) {
      validateAvailability(serviceData.availability);
    }

    let images = [];
    if (files && files.length > 0) {
      images = files.map((file) => ({
        name: file.originalname,
        url: `/uploads/${file.filename}`,
        mimeType: file.mimetype,
        size: file.size,
      }));
    }

    const newService = new Service({
      ...serviceData,
      coachId: userId,
      images: images,
    });

    return await newService.save();
  } catch (error) {
    throw error;
  }
};

const getServiceById = async (id) => {
  const service = await Service.findById(id).populate({
    path: "reviews",
    populate: {
      path: "clientId",
      select: "firstName lastName",
    },
  });

  if (!service) {
    throw new Error("Servicio no encontrado");
  }

  return service;
};

const updateServiceById = async (id, serviceData, userId, files) => {
  try {
    if (serviceData.availability) {
      validateAvailability(serviceData.availability);
    }

    const service = await Service.findById(id);
    if (!service) {
      throw new Error("Servicio no encontrado");
    }

    if (service.coachId.toString() !== userId.toString()) {
      throw new Error("No tienes permiso para editar este servicio");
    }

    let updatedData = { ...serviceData };
    let finalImages = [];

    if (serviceData.existingImages) {
      try {
        const existingImages = JSON.parse(serviceData.existingImages);
        finalImages = [...existingImages];
      } catch (error) {
        throw new Error("Error al procesar las imágenes existentes");
      }
    }

    if (files && files.length > 0) {
      const newImages = files.map((file) => ({
        name: file.originalname,
        url: `/uploads/${file.filename}`,
        mimeType: file.mimetype,
        size: file.size,
      }));

      finalImages = [...finalImages, ...newImages];
    }

    if (finalImages.length === 0) {
      finalImages = service.images;
    }

    updatedData.images = finalImages;
    delete updatedData.existingImages;

    return await Service.findByIdAndUpdate(id, updatedData, { new: true });
  } catch (error) {
    throw error;
  }
};

const deleteServiceById = async (id, userId) => {
  try {
    const service = await Service.findById(id);

    if (!service) {
      throw new Error("Servicio no encontrado");
    }

    if (!service.coachId) {
      throw new Error(
        "No se puede eliminar este servicio porque no tiene un coach asignado"
      );
    }

    if (service.coachId.toString() !== userId) {
      throw new Error("No tienes permiso para eliminar este servicio");
    }

    const contratos = await Contract.find({ serviceId: id });
    const tieneAceptados = contratos.some((c) => c.status === "Aceptado");

    if (tieneAceptados) {
      throw new Error(
        "No se puede eliminar este servicio porque tiene contratos aceptados"
      );
    }

    // Eliminar contratos no aceptados
    await Contract.deleteMany({ serviceId: id, status: { $ne: "Aceptado" } });

    // Eliminar imágenes del sistema de archivos
    if (service.images && service.images.length > 0) {
      service.images.forEach((image) => {
        try {
          const filePath = path.join(__dirname, "..", image.url);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (error) {
          console.error("Error al eliminar la imagen:", error);
        }
      });
    }

    await Service.findByIdAndDelete(id);

    return { message: "Servicio eliminado correctamente" };
  } catch (error) {
    console.error("Error en deleteServiceById:", error);
    throw error;
  }
};

const getServiceByCoachId = async (coachId) => {
  if (!coachId) {
    throw new Error("ID de coach no proporcionado");
  }

  return await Service.find({ coachId: coachId });
};

const incrementViews = async (id) => {
  const service = await Service.findById(id);
  service.views++;
  return await service.save();
};

const getOccupiedSessions = async (serviceId, date) => {
  const service = await Service.findById(serviceId);
  if (!service) {
    throw new Error("Servicio no encontrado");
  }

  const sesionesOcupadas = service.allScheduledSessions.filter(
    (s) => s.date === date
  );

  return sesionesOcupadas;
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

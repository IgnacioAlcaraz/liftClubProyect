const Service = require("../models/Service");
const fs = require("fs");
const path = require("path");

const getServices = async () => {
  const services = await Service.find().populate(
    "coachId",
    "firstName lastName"
  );
  return services;
};

const createService = async (serviceData, userId, files) => {
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
  const service = await Service.findById(id);

  if (!service) {
    throw new Error("Servicio no encontrado");
  }

  if (service.coachId.toString() !== userId.toString()) {
    throw new Error("No tienes permiso para editar este servicio");
  }

  let updatedData = { ...serviceData };

  if (files && files.length > 0) {
    if (service.images && service.images.length > 0) {
      service.images.forEach((image) => {
        try {
          const filePath = path.join(__dirname, "..", image.url);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (error) {
          console.error("Error al eliminar imagen antigua:", error);
        }
      });
    }

    const newImages = files.map((file) => ({
      name: file.originalname,
      url: `/uploads/${file.filename}`,
      mimeType: file.mimetype,
      size: file.size,
    }));

    updatedData.images = serviceData.images
      ? [...serviceData.images, ...newImages]
      : newImages;
  } else {
    updatedData.images = serviceData.images || [];
  }

  return await Service.findByIdAndUpdate(id, updatedData, { new: true });
};

const deleteServiceById = async (id, userId) => {
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
};

const getServiceByCoachId = async (coachId) => {
  if (!coachId) {
    throw new Error("ID de coach no proporcionado");
  }

  return await Service.find({ coachId: coachId });
};

module.exports = {
  getServices,
  createService,
  getServiceById,
  updateServiceById,
  deleteServiceById,
  getServiceByCoachId,
};

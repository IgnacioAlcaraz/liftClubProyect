const Service = require("../models/Service");

const getServices = async () => {
  const services = await Service.find().populate(
    "coachId",
    "firstName lastName"
  );
  return services;
};

const createService = async (serviceData, userId) => {
  const newService = new Service({
    ...serviceData,
    coachId: userId,
  });

  return await newService.save();
};

const getServiceById = async (id) => {
  const service = await Service.findById(id);

  if (!service) {
    throw new Error("Servicio no encontrado");
  }

  return service;
};

const updateServiceById = async (id, serviceData, userId) => {
  const service = await Service.findById(id);

  if (!service) {
    throw new Error("Servicio no encontrado");
  }

  if (service.coachId.toString() !== userId.toString()) {
    throw new Error("No tienes permiso para editar este servicio");
  }

  return await Service.findByIdAndUpdate(id, serviceData, { new: true });
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

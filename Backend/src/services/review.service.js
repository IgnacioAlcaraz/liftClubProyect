const Review = require("../models/Review");
const Contract = require("../models/Contract");
const User = require("../models/User");
const Service = require("../models/Service");

const createReview = async (reviewData, userId) => {
  const contract = await Contract.findById(reviewData.contractId);
  if (!contract) {
    throw new Error("Contrato no encontrado");
  }

  if (contract.clientId.toString() !== userId.toString()) {
    throw new Error(
      "No puedes crear una reseña para un contrato que no te pertenece"
    );
  }

  if (contract.reviewSubmitted) {
    throw new Error("El contrato ya tiene una reseña");
  }

  if (contract.status !== "Completado") {
    throw new Error("Solo puedes crear reseñas para contratos completados");
  }

  const newReview = new Review({
    ...reviewData,
    clientId: userId,
    trainerId: contract.coachId,
    serviceId: contract.serviceId,
  });

  const savedReview = await newReview.save();

  // Actualiza el promedio en el servicio
  await updateAverageRating(newReview.serviceId);

  contract.reviewSubmitted = true;
  await contract.save();

  return savedReview;
};

const getReviewsByServiceId = async (serviceId, page, limit) => {
  const skip = (page - 1) * limit;
  const reviews = await Review.find({ serviceId })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  const total = await Review.countDocuments({ serviceId });
  return {
    reviews,
    total,
    currentPage: parseInt(page),
    totalPages: Math.ceil(total / limit),
  };
};

const getReviewsByTrainerId = async (trainerId, page, limit) => {
  const skip = (page - 1) * limit;
  const reviews = await Review.find({ trainerId })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  const total = await Review.countDocuments({ trainerId });
  return {
    reviews,
    total,
    currentPage: parseInt(page),
    totalPages: Math.ceil(total / limit),
  };
};

const respondToReview = async (reviewId, response, userId) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new Error("Reseña no encontrada");
  }

  if (review.trainerId.toString() !== userId.toString()) {
    throw new Error("No puedes responder a una reseña que no te pertenece");
  }

  if (review.trainerResponse && review.trainerResponse.length > 0) {
    throw new Error("Ya has respondido a esta reseña");
  }

  review.trainerResponse = response;
  return await review.save();
};

const updateAverageRating = async (serviceId) => {
  const reviews = await Review.find({ serviceId }); // 1. Busca todas las reseñas del servicio por su ID

  if (!reviews.length) return; // 2. Si no hay reseñas, no hace nada

  const sum = reviews.reduce((acc, review) => acc + review.rating, 0); // 3. Suma todos los ratings de las reseñas
  const average = sum / reviews.length; // 4. Divide la suma entre la cantidad total de reseñas para obtener el promedio

  await Service.findByIdAndUpdate(serviceId, {
    averageRating: average.toFixed(1), // 5. Actualiza el servicio con el promedio, redondeado a un decimal
  });
};

module.exports = {
  createReview,
  getReviewsByServiceId,
  getReviewsByTrainerId,
  respondToReview,
};

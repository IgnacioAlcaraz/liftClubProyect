const Review = require("../models/Review");
const Contract = require("../models/Contract");
const User = require("../models/User");

const createReview = async (reviewData, userId) => {
  const contract = await Contract.findById(reviewData.contractId);
  if (!contract) {
    throw new Error("Contrato no encontrado");
  }

  if (contract.clientId.toString() !== userId.toString()) {
    throw new Error("No puedes crear una reseña para un contrato que no te pertenece");
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
    serviceId: contract.serviceId
  });

  const savedReview = await newReview.save();

  contract.reviewSubmitted = true;
  await contract.save();

  return savedReview;
};

const getReviewsByServiceId = async (serviceId) => {
  return await Review.find({ serviceId });
};

const getReviewsByTrainerId = async (trainerId) => {
  return await Review.find({ trainerId });
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

module.exports = {
    createReview,
    getReviewsByServiceId,
    getReviewsByTrainerId,
    respondToReview
  };
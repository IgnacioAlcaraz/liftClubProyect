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

  await Service.findByIdAndUpdate(
    contract.serviceId,
    { $addToSet: { reviews: savedReview._id } },
    { new: true }
  );

  await updateAverageRating(savedReview.serviceId);

  contract.reviewSubmitted = true;
  await contract.save();

  return savedReview;
};

const getReviewsByServiceId = async (serviceId, page, limit) => {
  const skip = (page - 1) * limit;
  const reviews = await Review.find({ serviceId })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate("clientId", "firstName lastName");

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
    .sort({ createdAt: -1 })
    .populate("clientId", "firstName lastName");

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
  const reviews = await Review.find({ serviceId });

  if (!reviews.length) return;

  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  const average = sum / reviews.length;

  await Service.findByIdAndUpdate(serviceId, {
    averageRating: average.toFixed(1),
  });
};

module.exports = {
  createReview,
  getReviewsByServiceId,
  getReviewsByTrainerId,
  respondToReview,
};

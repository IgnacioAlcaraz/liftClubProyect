const reviewService = require("../services/review.service");

const createReview = async (req, res) => {
  try {
    const { userId, role } = req.user;

    if (role !== "client") {
      return res
        .status(403)
        .json({ message: "Solo los clientes pueden crear reseñas" });
    }

    const savedReview = await reviewService.createReview(req.body, userId);
    return res.status(201).json(savedReview);
  } catch (error) {
    if (error.message === "Contrato no encontrado") {
      return res.status(404).json({ message: error.message });
    }
    if (
      error.message === "El contrato ya tiene una reseña" ||
      error.message === "Solo puedes crear reseñas para contratos completados"
    ) {
      return res.status(400).json({ message: error.message });
    }
    if (error.message.includes("No puedes crear una reseña")) {
      return res.status(403).json({ message: error.message });
    }
    return res
      .status(500)
      .json({ message: "Error al crear la reseña", error: error.message });
  }
};

const getReviewsByServiceId = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await reviewService.getReviewsByServiceId(
      serviceId,
      page,
      limit
    );
    return res.status(200).json(reviews);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener las reseñas", error: error.message });
  }
};

const getReviewsByCoachId = async (req, res) => {
  try {
    const { coachId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await reviewService.getReviewsByCoachId(
      coachId,
      page,
      limit
    );
    return res.status(200).json(reviews);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener las reseñas", error: error.message });
  }
};

const respondToReview = async (req, res) => {
  try {
    const { userId, role } = req.user;

    if (role !== "coach") {
      return res.status(403).json({
        message: "Solo los entrenadores pueden responder a las reseñas",
      });
    }

    const { id } = req.params;
    const { trainerResponse } = req.body;

    const review = await reviewService.respondToReview(
      id,
      trainerResponse,
      userId
    );
    return res
      .status(200)
      .json({ message: "Respuesta enviada correctamente", review });
  } catch (error) {
    if (error.message === "Reseña no encontrada") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes("No puedes responder")) {
      return res.status(403).json({ message: error.message });
    }
    if (error.message === "Ya has respondido a esta reseña") {
      return res.status(400).json({ message: error.message });
    }
    return res
      .status(500)
      .json({ message: "Error al enviar la respuesta", error: error.message });
  }
};

module.exports = {
  createReview,
  getReviewsByServiceId,
  getReviewsByCoachId,
  respondToReview,
};

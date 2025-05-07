const Review = require("../models/Review");
const Contract = require("../models/Contract");

const createReview = async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== "client") {
            return res.status(403).json({message: "Solo los clientes pueden crear reseñas"});
        }

        const {contractId} = req.body;
        const contract = await Contract.findById(contractId);
        if (!contract) {
            return res.status(404).json({message: "Contrato no encontrado"});
        }

        if (contract.reviewSubmitted) {
            return res.status(400).json({message: "El contrato ya tiene una reseña"});
        }

        const reviewData = { ...req.body, clientId: user.userId};
        const newReview = new Review(reviewData);
        const savedReview = await newReview.save();

        contract.reviewSubmitted = true;
        await contract.save();

        res.status(201).json(savedReview);
    } catch (error) {
        res.status(500).json({message: "Error al crear la reseña", error});
    }
}

const getReviewsByServiceId = async (req, res) => {
    try {
        const {serviceId} = req.params;
        const reviews = await Review.find({serviceId});
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({message: "Error al obtener las reseñas", error});
    }
}

const getReviewsByTrainerId = async (req, res) => {
    try {
        const {trainerId} = req.params;
        const reviews = await Review.find({trainerId});
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({message: "Error al obtener las reseñas", error});
    }
}

const respondToReview = async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== "coach") {
            return res.status(403).json({message: "Solo los entrenadores pueden responder a las reseñas"});
        }

        const {id} = req.params;
        const {response} = req.body;

        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({message: "Reseña no encontrada"});
        }

        review.trainerResponse = response;
        await review.save();

        res.status(200).json({message: "Respuesta enviada correctamente", review});
    } catch (error) {
        res.status(500).json({message: "Error al enviar la respuesta", error});
    }
}

module.exports = {
    createReview,
    getReviewsByServiceId,
    getReviewsByTrainerId,
    respondToReview
}
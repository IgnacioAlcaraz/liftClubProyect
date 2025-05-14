const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");
const auth = require("../middlewares/auth");


router.post("/", auth, reviewController.createReview);

router.get("/:serviceId", auth, reviewController.getReviewsByServiceId);

router.get("/trainer/:trainerId", auth, reviewController.getReviewsByTrainerId);

router.patch("/:id", auth, reviewController.respondToReview);

module.exports = router;

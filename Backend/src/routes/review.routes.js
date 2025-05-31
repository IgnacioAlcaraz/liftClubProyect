const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");
const auth = require("../middlewares/auth");

router.post("/", auth, reviewController.createReview);

router.get("/:serviceId", auth, reviewController.getReviewsByServiceId);

router.get("/coach/:coachId", auth, reviewController.getReviewsByCoachId);

router.patch("/:id", auth, reviewController.respondToReview);

module.exports = router;

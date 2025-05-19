const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    contractId: {
        type: Schema.Types.ObjectId,
        ref: "Contract",
        required: true,
    },
    serviceId: {
        type: Schema.Types.ObjectId,
        ref: "Service",
        required: true,
    },
    trainerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    clientId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    trainerResponse: {
        type: String,
        default: ""
    }
}, {timestamps: true})

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;

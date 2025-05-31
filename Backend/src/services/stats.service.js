const Service = require("../models/Service");
const Review = require("../models/Review");
const Contract = require("../models/Contract");

const getStats = async (id) => {
  const views = await getViews(id);
  const averageRating = await getAverageRating(id);
  const totalRatings = await getTotalRatings(id);
  const conversionRate = await getConversionRate(id);
  const conversionRatePerService = await getConversionRatePerService(id);
  const distribution = await getDistribution(id);

  const stats = {
    views,
    averageRating,
    totalRatings,
    conversionRate,
    distribution,
    conversionRatePerService,
  };
  return stats;
};

const getViews = async (id) => {
  const services = await Service.find({ coachId: id });

  let views = 0;
  for (const service of services) {
    views += service.views;
  }

  return views;
};

const getAverageRating = async (id) => {
  const services = await Service.find({ coachId: id });

  if (services.length === 0) {
    return 0;
  }

  const reviews = await Review.find({ coachId: id });

  let totalRatings = 0;
  for (const review of reviews) {
    totalRatings += review.rating;
  }

  const averageRating = totalRatings / reviews.length;

  return (averageRating || 0).toFixed(1);
};

const getTotalRatings = async (id) => {
  const reviews = await Review.find({ coachId: id });
  const totalRatings = reviews.length;
  return totalRatings;
};

const getConversionRate = async (id) => {
  const views = await getViews(id);

  if (views === 0) {
    return 0;
  }

  const contracts = await Contract.find({ coachId: id });
  const conversionRate = (contracts.length / views) * 100;
  return (conversionRate || 0).toFixed(1);
};

const getDistribution = async (id) => {
  const reviews = await Review.find({ coachId: id });

  const distribution = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  for (const review of reviews) {
    distribution[parseInt(review.rating)]++;
  }

  return distribution;
};

const getConversionRatePerService = async (id) => {
  const services = await Service.find({ coachId: id });

  const conversionRatePerService = {};

  for (const service of services) {
    if (service.views === 0) {
      conversionRatePerService[service.name] = 0;
      continue;
    }

    const contracts = await Contract.find({ serviceId: service._id });

    const conversionRate = (contracts.length / service.views) * 100;

    conversionRatePerService[service.name] = (conversionRate || 0).toFixed(1);
  }

  return conversionRatePerService;
};

module.exports = { getStats };

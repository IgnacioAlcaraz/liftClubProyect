const statsService = require("../services/stats.service");

const getStats = async (req, res) => {
  try {
    const { user } = req;

    if (user.role !== "coach") {
      return res
        .status(403)
        .json({ message: "Solo los coaches pueden obtener estadisticas" });
    }

    const stats = await statsService.getStats(user.userId);
    return res.status(200).json(stats);
  } catch (error) {
    if (error.message.includes("Estadisticas no encontradas")) {
      return res.status(404).json({ message: "Estadisticas no encontradas" });
    }
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats };

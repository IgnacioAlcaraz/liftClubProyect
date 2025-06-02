import React from "react";
import "./visitPanel.css";

const VisitPanel = ({
  totalViews,
  conversionRate,
  conversionRatePerService,
}) => {
  const getScaledWidth = (rate) => {
    if (rate === 0) return 0;

    const minWidth = 10;
    const scaledWidth = minWidth + (rate * (100 - minWidth)) / 100;

    return Math.min(scaledWidth, 100);
  };

  return (
    <div>
      <h3>Estadísticas de Visualización</h3>
      <div className="visit-stats">
        <div className="visit-metrics">
          <div className="metric-card">
            <div className="metric-value">{totalViews}</div>
            <div className="metric-label">Visitas totales al perfil</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{conversionRate}%</div>
            <div className="metric-label">
              Total de conversión por servicios
            </div>
          </div>
        </div>

        <div className="service-conversion">
          <h4>Desglose por servicios</h4>
          {conversionRatePerService &&
            Object.entries(conversionRatePerService).map(([service, rate]) => (
              <div key={service} className="service-item">
                <div className="service-header">
                  <span>{service}</span>
                  <span>{rate}%</span>
                </div>
                <div className="service-bar">
                  <div
                    className="service-bar-fill"
                    style={{ width: `${getScaledWidth(rate)}%` }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default VisitPanel;
